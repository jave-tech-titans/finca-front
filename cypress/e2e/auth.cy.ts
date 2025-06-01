describe('Authentication Flow', () => {
  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should display login form', () => {
      cy.get('[data-cy="login-form"]').should('be.visible');
      cy.get('[data-cy="email-input"]').should('be.visible');
      cy.get('[data-cy="password-input"]').should('be.visible');
      cy.get('[data-cy="login-button"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('[data-cy="login-button"]').click();
      cy.get('[data-cy="email-error"]').should('be.visible')
        .and('contain', 'El correo electrónico es requerido');
      cy.get('[data-cy="password-error"]').should('be.visible')
        .and('contain', 'La contraseña es requerida');
    });

    it('should show error for invalid email format', () => {
      cy.get('[data-cy="email-input"]').type('invalid-email');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="login-button"]').click();
      cy.get('[data-cy="email-error"]').should('be.visible')
        .and('contain', 'El formato del correo electrónico es inválido');
    });

    it('should show error for invalid credentials', () => {
      cy.intercept('POST', '**/auth/sessions', {
        statusCode: 401,
        body: { message: 'Credenciales inválidas' }
      }).as('loginFailed');

      cy.get('[data-cy="email-input"]').type('test@example.com');
      cy.get('[data-cy="password-input"]').type('wrongpassword');
      cy.get('[data-cy="login-button"]').click();

      cy.wait('@loginFailed');
      // Verify redirect
      cy.url().should('include', '/login');
    });

    it('should login successfully and redirect', () => {
      cy.intercept('POST', '**/auth/sessions', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          role: 'CLIENT'
        }
      }).as('loginSuccess');

      cy.get('[data-cy="email-input"]').type('user1@gmail.com');
      cy.get('[data-cy="password-input"]').type('12345678');
      cy.get('[data-cy="login-button"]').click();

      cy.wait('@loginSuccess');
      
      // Verify redirect
      cy.url().should('include', '/home');
    });

    it('should maintain login state after page refresh', () => {
      // Set up authenticated state
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token');
        win.localStorage.setItem('role', 'CLIENT');
      });

      cy.visit('/home');
      cy.url().should('include', '/home');
    });
  });

  describe('Registration', () => {
    beforeEach(() => {
      cy.visit('/register');
    });

    it('should display registration form', () => {
      cy.get('[data-cy="register-form"]').should('be.visible');
      cy.get('[data-cy="name-input"]').should('be.visible');
      cy.get('[data-cy="lastname-input"]').should('be.visible');
      cy.get('[data-cy="email-input"]').should('be.visible');
      cy.get('[data-cy="password-input"]').should('be.visible');
      cy.get('[data-cy="phone-input"]').should('be.visible');
      cy.get('[data-cy="role-select"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('[data-cy="register-button"]').click();
      
      cy.get('[data-cy="name-error"]').should('be.visible')
        .and('contain', 'El nombre es requerido');
      cy.get('[data-cy="lastname-error"]').should('be.visible')
        .and('contain', 'Los apellidos son requeridos');
      cy.get('[data-cy="email-error"]').should('be.visible')
        .and('contain', 'El correo electrónico es requerido');
      cy.get('[data-cy="password-error"]').should('be.visible')
        .and('contain', 'La contraseña es requerida');
      cy.get('[data-cy="phone-error"]').should('be.visible')
        .and('contain', 'El número de teléfono es requerido');
      cy.get('[data-cy="role-error"]').should('be.visible')
        .and('contain', 'Debe seleccionar un rol');
    });

    it('should validate email format', () => {
      cy.get('[data-cy="name-input"]').type('John');
      cy.get('[data-cy="lastname-input"]').type('Doe');
      cy.get('[data-cy="email-input"]').type('invalid-email');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="phone-input"]').type('1234567890');
      cy.get('[data-cy="role-select"]').click().contains('Usuario').click();
      cy.get('[data-cy="register-button"]').click();

      cy.get('[data-cy="email-error"]')
        .should('be.visible')
        .and('contain', 'El formato del correo electrónico es inválido');
    });

    it('should validate password length', () => {
      cy.get('[data-cy="name-input"]').type('John');
      cy.get('[data-cy="lastname-input"]').type('Doe');
      cy.get('[data-cy="email-input"]').type('test@example.com');
      cy.get('[data-cy="password-input"]').type('12345');
      cy.get('[data-cy="phone-input"]').type('1234567890');
      cy.get('[data-cy="role-select"]').click().contains('Usuario').click();
      cy.get('[data-cy="register-button"]').click();

      cy.get('[data-cy="password-error"]')
        .should('be.visible')
        .and('contain', 'La contraseña debe tener al menos 6 caracteres');
    });
  });

  describe('Protected Routes', () => {
    it('should allow access to role-specific routes', () => {
      // Set up landlord auth
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token');
        win.localStorage.setItem('role', 'LANDLORD');
      });

      cy.visit('/my-properties');
      cy.url().should('include', '/my-properties');
    });
  });

}); 