
describe('Payment Page Component', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'CLIENT');
    });
    cy.visit('/rental-requests/123/payment');
  });

  it('debe mostrar spinner durante la carga', () => {
    cy.get('.animate-spin').should('exist');
  });

  it('debe mostrar mensaje de error si aplica', () => {
    cy.contains('Error').should('exist');
  });

  it('debe renderizar formulario o contenido principal', () => {
    cy.get('div.bg-white').should('exist');
  });

  it('debe incluir app-menu', () => {
    cy.get('app-menu').should('exist');
  });

  it('debe tener estructura responsive con max-width', () => {
    cy.get('div.max-w-3xl').should('exist');
  });

  it('debe usar clases de espaciado', () => {
    cy.get('div.py-12').should('exist');
  });

  it('debe contener zona centrada', () => {
    cy.get('div.content-center').should('exist');
  });
});
