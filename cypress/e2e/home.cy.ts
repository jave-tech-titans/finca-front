
describe('Home Component', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'CLIENT');
    });
    cy.visit('/home');
  });

  describe('Contenido visual', () => {
    it('debe mostrar el título principal', () => {
      cy.contains('h1', 'Bienvenido a Renta una Finca').should('be.visible');
    });

    it('debe mostrar el subtítulo descriptivo', () => {
      cy.contains('Encuentra el lugar perfecto para tu escapada soñada.').should('be.visible');
    });

    it('debe mostrar el título de sección ¿Por qué elegirnos?', () => {
      cy.contains('h2', '¿Por qué elegirnos?').should('be.visible');
    });

    it('debe renderizar el componente de menú', () => {
      cy.get('app-menu').should('exist');
    });

    it('debe contener el elemento principal main', () => {
      cy.get('main').should('have.class', 'py-16');
    });

    it('debe contener la sección informativa', () => {
      cy.get('section').should('exist').and('have.class', 'text-center');
    });

    it('debe renderizar fondo oscuro en el hero section', () => {
      cy.get('div.bg-black\/50').should('exist');
    });
  });
});
