
describe('User Requests Component', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'CLIENT');
    });
    cy.visit('/userrequests');
  });

  it('debe mostrar el título principal', () => {
    cy.contains('My Rental Requests').should('exist');
  });

  it('debe mostrar estado de carga con spinner', () => {
    cy.get('p-progressSpinner').should('exist');
  });

  it('debe mostrar mensaje de error si aplica', () => {
    cy.contains('Error loading requests').should('exist');
  });

  it('debe tener fondo de página correcto', () => {
    cy.get('div.bg-slate-200').should('exist');
  });

  it('debe contener card blanca con sombra', () => {
    cy.get('div.bg-white.rounded-lg.shadow-lg').should('exist');
  });

  it('debe contener app-menu', () => {
    cy.get('app-menu').should('exist');
  });

  it('debe tener padding interno adecuado', () => {
    cy.get('div.p-6').should('exist');
  });
});
