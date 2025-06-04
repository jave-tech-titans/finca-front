
describe('Rent Property Component', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'CLIENT');
    });
    cy.visit('/rent/properties/1');
  });

  it('debe mostrar sección de error si hay un problema', () => {
    cy.get('h3').contains('Error cargando propiedad').should('exist');
  });

  it('debe mostrar fondo blanco durante la carga', () => {
    cy.get('div.bg-white').should('exist');
  });

  it('debe contener la clase shadow-lg', () => {
    cy.get('div.shadow-lg').should('exist');
  });

  it('debe renderizar el menú superior', () => {
    cy.get('app-menu').should('exist');
  });

  it('debe mostrar toast de notificaciones', () => {
    cy.get('p-toast').should('exist');
  });

  it('debe contener main con padding y fondo', () => {
    cy.get('main').should('have.class', 'pt-20').and('have.class', 'bg-slate-200');
  });

  it('debe tener contenedor de ancho limitado', () => {
    cy.get('div.max-w-7xl').should('exist');
  });
});
