const request = require('supertest');
const app = require('../server');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

const pool = require('../db');

afterEach(() => {
  jest.clearAllMocks();
});

// ─── GET /api/clientes ────────────────────────────────────────────────────────

describe('GET /api/clientes', () => {
  it('retorna lista de clientes com status 200', async () => {
    const clientes = [
      { id: 1, nome: 'Ana', email: 'ana@email.com', telefone: '99999', cidade: 'SP' },
    ];
    pool.query.mockResolvedValueOnce({ rows: clientes });

    const res = await request(app).get('/api/clientes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(clientes);
  });

  it('retorna 500 quando o banco falha', async () => {
    pool.query.mockRejectedValueOnce(new Error('Conexão recusada'));

    const res = await request(app).get('/api/clientes');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('erro');
  });
});

// ─── GET /api/clientes/:id ────────────────────────────────────────────────────

describe('GET /api/clientes/:id', () => {
  it('retorna o cliente pelo id com status 200', async () => {
    const cliente = { id: 1, nome: 'Ana', email: 'ana@email.com', telefone: '99999', cidade: 'SP' };
    pool.query.mockResolvedValueOnce({ rows: [cliente] });

    const res = await request(app).get('/api/clientes/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(cliente);
  });

  it('retorna 404 quando o cliente não existe', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/api/clientes/999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('erro', 'Cliente não encontrado');
  });

  it('retorna 500 quando o banco falha', async () => {
    pool.query.mockRejectedValueOnce(new Error('Timeout'));

    const res = await request(app).get('/api/clientes/1');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('erro');
  });
});

// ─── POST /api/clientes ───────────────────────────────────────────────────────

describe('POST /api/clientes', () => {
  it('cria um cliente e retorna 201', async () => {
    const novoCliente = { id: 1, nome: 'Ana', email: 'ana@email.com', telefone: '99999', cidade: 'SP' };
    pool.query.mockResolvedValueOnce({ rows: [novoCliente] });

    const res = await request(app)
      .post('/api/clientes')
      .send({ nome: 'Ana', email: 'ana@email.com', telefone: '99999', cidade: 'SP' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(novoCliente);
  });

  it('retorna 400 quando nome está ausente', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .send({ email: 'ana@email.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro', 'Nome e e-mail são obrigatórios');
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('retorna 400 quando email está ausente', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .send({ nome: 'Ana' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro', 'Nome e e-mail são obrigatórios');
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('retorna 409 quando o e-mail já está cadastrado', async () => {
    const erroDuplicado = new Error('duplicate key');
    erroDuplicado.code = '23505'; // código PostgreSQL para unique_violation
    pool.query.mockRejectedValueOnce(erroDuplicado);

    const res = await request(app)
      .post('/api/clientes')
      .send({ nome: 'Ana', email: 'ana@email.com' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('erro', 'E-mail já cadastrado');
  });

  it('retorna 500 quando o banco falha por outro motivo', async () => {
    pool.query.mockRejectedValueOnce(new Error('Erro interno'));

    const res = await request(app)
      .post('/api/clientes')
      .send({ nome: 'Ana', email: 'ana@email.com' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('erro');
  });
});

// ─── PUT /api/clientes/:id ────────────────────────────────────────────────────

describe('PUT /api/clientes/:id', () => {
  it('atualiza o cliente e retorna 200', async () => {
    const clienteAtualizado = { id: 1, nome: 'Ana Silva', email: 'ana@email.com', telefone: '88888', cidade: 'RJ' };
    pool.query.mockResolvedValueOnce({ rows: [clienteAtualizado] });

    const res = await request(app)
      .put('/api/clientes/1')
      .send({ nome: 'Ana Silva', email: 'ana@email.com', telefone: '88888', cidade: 'RJ' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(clienteAtualizado);
  });

  it('retorna 400 quando nome está ausente', async () => {
    const res = await request(app)
      .put('/api/clientes/1')
      .send({ email: 'ana@email.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro', 'Nome e e-mail são obrigatórios');
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('retorna 400 quando email está ausente', async () => {
    const res = await request(app)
      .put('/api/clientes/1')
      .send({ nome: 'Ana' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro', 'Nome e e-mail são obrigatórios');
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('retorna 404 quando o cliente não existe', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .put('/api/clientes/999')
      .send({ nome: 'Ana', email: 'ana@email.com' });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('erro', 'Cliente não encontrado');
  });

  it('retorna 409 quando o novo e-mail já pertence a outro cliente', async () => {
    const erroDuplicado = new Error('duplicate key');
    erroDuplicado.code = '23505';
    pool.query.mockRejectedValueOnce(erroDuplicado);

    const res = await request(app)
      .put('/api/clientes/1')
      .send({ nome: 'Ana', email: 'outro@email.com' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('erro', 'E-mail já cadastrado');
  });

  it('retorna 500 quando o banco falha por outro motivo', async () => {
    pool.query.mockRejectedValueOnce(new Error('Erro interno'));

    const res = await request(app)
      .put('/api/clientes/1')
      .send({ nome: 'Ana', email: 'ana@email.com' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('erro');
  });
});

// ─── DELETE /api/clientes/:id ─────────────────────────────────────────────────

describe('DELETE /api/clientes/:id', () => {
  it('exclui o cliente e retorna 204', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app).delete('/api/clientes/1');

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('retorna 404 quando o cliente não existe', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app).delete('/api/clientes/999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('erro', 'Cliente não encontrado');
  });

  it('retorna 500 quando o banco falha', async () => {
    pool.query.mockRejectedValueOnce(new Error('Falha ao deletar'));

    const res = await request(app).delete('/api/clientes/1');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('erro');
  });
});