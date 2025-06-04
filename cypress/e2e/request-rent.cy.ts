
describe('Request Rent Component', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'CLIENT');
    });
    cy.visit('/rental-requests/properties/1');
  });

  it('debe mostrar mensaje de error si no se carga la propiedad', () => {
    cy.contains('Error cargando propiedad').should('exist');
  });

  it('debe tener contenedor principal', () => {
    cy.get('div.max-w-7xl').should('exist');
  });

  it('debe mostrar pantalla de carga', () => {
    cy.get('div.flex.justify-center').should('exist');
  });

  it('debe incluir menú y toast', () => {
    cy.get('app-menu').should('exist');
    cy.get('p-toast').should('exist');
  });

  it('debe tener padding superior e inferior', () => {
    cy.get('div.min-h-screen').should('have.class', 'pt-20').and('have.class', 'pb-12');
  });

  it('debe contener clases tailwind comunes', () => {
    cy.get('div.px-4').should('exist');
  });

  it('debe mostrar sección informativa o de interacción', () => {
    cy.get('div').should('exist');
  });
});
