
describe('Confirm Account Component', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
    cy.visit('/auth/confirmation/abc123');
  });

  it('debe renderizar mensaje de procesamiento', () => {
    cy.contains('Procesando').should('exist');
  });

  it('debe contener componente de toast', () => {
    cy.get('p-toast').should('exist');
  });

  it('debe estar en ruta correcta', () => {
    cy.url().should('include', '/auth/confirmation');
  });

  it('debe incluir elementos visibles', () => {
    cy.get('p').should('have.length.at.least', 1);
  });

  it('debe tener tokens en localStorage', () => {
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.equal('fake-jwt-token');
    });
  });

  it('debe mostrar algún tipo de respuesta al usuario', () => {
    cy.get('p').first().should('be.visible');
  });

  it('debe tener al menos un toast renderizado', () => {
    cy.get('p-toast').should('exist');
  });
});
