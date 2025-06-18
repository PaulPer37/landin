"use strict";

import { saveVote, getVotes } from './firebase.js';
/**
 * Habilita el formulario de votación y envía los datos a Firebase.
 */
const enableForm = () => {
  const form = document.getElementById('form_voting');
  const select = document.getElementById('select_product');
  if (!form || !select) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = select.value;
    if (!value) return;

    // Guardar voto en Firebase
    const result = await saveVote(value);

    // Mostrar mensaje de éxito o error
    alert(result.message);

    // Limpiar formulario
    form.reset();

    // Actualizar la tabla de resultados
    displayVotes();
  });
};

/**
 * Obtiene los votos de Firebase y los muestra en una tabla.
 */
const displayVotes = async () => {
  const results = document.getElementById('results');
  if (!results) return;

  const response = await getVotes();
  if (!response.success) {
    results.innerHTML = `<p class="text-red-500 text-center mt-16">${response.message}</p>`;
    return;
  }

  const votes = response.data || {};
  // Contar votos por producto
  const counts = { Tecnología: 0, Hogar: 0, Deportivo: 0 ,Regalo: 0};
  Object.values(votes).forEach(vote => {
    if (vote.product && counts.hasOwnProperty(vote.product)) {
      counts[vote.product]++;
    }
  });
  const total = counts.Tecnología + counts.Hogar + counts.Deportivo + counts.Regalo;

  // Crear tabla
  results.innerHTML = `
    <h3 class="text-lg font-semibold mb-2 text-gray-700">Resultados:</h3>
    <table class="min-w-full text-center">
      <thead>
        <tr>
          <th class="px-4 py-2">Producto</th>
          <th class="px-4 py-2">Votos</th>
          <th class="px-4 py-2">Porcentaje</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Tecnología</td>
          <td>${counts.Tecnología}</td>
          <td>${total ? ((counts.Tecnología/total)*100).toFixed(1) : 0}%</td>
        </tr>
        <tr>
          <td>Hogar</td>
          <td>${counts.Hogar}</td>
          <td>${total ? ((counts.Hogar/total)*100).toFixed(1) : 0}%</td>
        </tr>
        <tr>
          <td>Deportivo</td>
          <td>${counts.Deportivo}</td>
          <td>${total ? ((counts.Deportivo/total)*100).toFixed(1) : 0}%</td>
        </tr>
        <tr>
          <td>Regalo</td>
          <td>${counts.Regalo}</td>
          <td>${total ? ((counts.Regalo/total)*100).toFixed(1) : 0}%</td>
        </tr>
      </tbody>
    </table>
    <p class="mt-4 text-sm text-gray-500">Total de votos: ${total}</p>
  `;
};
/**
 * Función de autoejecución que inicializa la interfaz.
 * @function
 * @returns {void}
 */
(() => {
  enableForm();
  displayVotes();
})();