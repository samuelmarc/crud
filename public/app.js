const API = '/api/clientes';
let idParaExcluir = null;
const modalExcluir = new bootstrap.Modal('#modal-excluir');

function alerta(msg, tipo = 'danger') {
  $('#alerta').html(`<div class="alert alert-${tipo} alert-dismissible py-2" role="alert">
    ${msg}<button type="button" class="btn-close py-2" data-bs-dismiss="alert"></button>
  </div>`);
}

function renderTabela(clientes) {
  if (!clientes.length) {
    $('#tbody').html('<tr><td colspan="6" class="text-center text-muted py-3">Nenhum cliente cadastrado.</td></tr>');
    return;
  }
  const linhas = clientes.map(c => `
    <tr>
      <td class="text-muted">${c.id}</td>
      <td>${c.nome}</td>
      <td>${c.email}</td>
      <td>${c.telefone || '-'}</td>
      <td>${c.cidade || '-'}</td>
      <td class="text-end">
        <button class="btn btn-outline-secondary btn-xs me-1 btn-editar" data-id="${c.id}">Editar</button>
        <button class="btn btn-outline-danger btn-xs btn-excluir" data-id="${c.id}">Excluir</button>
      </td>
    </tr>`).join('');
  $('#tbody').html(linhas);
}

function carregarClientes() {
  $.get(API).done(renderTabela).fail(() => alerta('Erro ao carregar clientes.'));
}

function limparForm() {
  $('#cliente-id, #nome, #email, #telefone, #cidade').val('');
  $('#form-cliente .is-invalid').removeClass('is-invalid');
}

function abrirFormNovo() {
  limparForm();
  $('#form-titulo').text('Novo Cliente');
  $('#card-form').removeClass('d-none');
  $('#nome').focus();
}

function fecharForm() {
  $('#card-form').addClass('d-none');
  limparForm();
}

function validarForm() {
  let valido = true;
  ['nome', 'email'].forEach(campo => {
    const el = $(`#${campo}`);
    if (!el.val().trim()) {
      el.addClass('is-invalid');
      valido = false;
    } else {
      el.removeClass('is-invalid');
    }
  });
  return valido;
}

$('#btn-novo').on('click', abrirFormNovo);
$('#btn-cancelar').on('click', fecharForm);

$('#form-cliente').on('submit', function (e) {
  e.preventDefault();
  if (!validarForm()) return;

  const dados = {
    nome: $('#nome').val().trim(),
    email: $('#email').val().trim(),
    telefone: $('#telefone').val().trim(),
    cidade: $('#cidade').val().trim(),
  };

  const id = $('#cliente-id').val();
  const requisicao = id
    ? $.ajax({ url: `${API}/${id}`, method: 'PUT', contentType: 'application/json', data: JSON.stringify(dados) })
    : $.ajax({ url: API, method: 'POST', contentType: 'application/json', data: JSON.stringify(dados) });

  requisicao
    .done(() => {
      fecharForm();
      carregarClientes();
      alerta(id ? 'Cliente atualizado.' : 'Cliente cadastrado.', 'success');
    })
    .fail(xhr => {
      const msg = xhr.responseJSON?.erro || 'Erro ao salvar.';
      alerta(msg);
    });
});

$('#tbody').on('click', '.btn-editar', function () {
  const id = $(this).data('id');
  $.get(`${API}/${id}`)
    .done(c => {
      $('#cliente-id').val(c.id);
      $('#nome').val(c.nome);
      $('#email').val(c.email);
      $('#telefone').val(c.telefone);
      $('#cidade').val(c.cidade);
      $('#form-titulo').text('Editar Cliente');
      $('#card-form').removeClass('d-none');
      $('#nome').focus();
    })
    .fail(() => alerta('Erro ao carregar cliente.'));
});

$('#tbody').on('click', '.btn-excluir', function () {
  idParaExcluir = $(this).data('id');
  modalExcluir.show();
});

$('#btn-confirmar-excluir').on('click', function () {
  $.ajax({ url: `${API}/${idParaExcluir}`, method: 'DELETE' })
    .done(() => {
      modalExcluir.hide();
      carregarClientes();
      alerta('Cliente excluído.', 'warning');
    })
    .fail(() => alerta('Erro ao excluir.'));
});

$('#nome, #email').on('input', function () {
  $(this).removeClass('is-invalid');
});

carregarClientes();
