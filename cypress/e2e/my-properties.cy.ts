
describe('My Properties Component', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'LANDLORD');
    });
    cy.visit('/my-properties');
  });

  it('debe mostrar el encabezado', () => {
    cy.contains('Mis propiedades').should('exist');
  });

  it('debe mostrar botón para crear propiedad', () => {
    cy.get('button').contains('Crear propiedad').should('exist');
  });

  it('debe tener clase de fondo gris', () => {
    cy.get('div.bg-gray-100').should('exist');
  });

  it('debe mostrar spinner si está cargando', () => {
    cy.get('.animate-spin').should('exist');
  });

  it('debe tener contenedor centrado y ancho máximo', () => {
    cy.get('div.max-w-7xl').should('exist');
  });

  it('debe incluir componente de menú', () => {
    cy.get('app-menu').should('exist');
  });

  it('debe tener zona de contenido principal', () => {
    cy.get('div.content-center').should('exist');
  });
});
