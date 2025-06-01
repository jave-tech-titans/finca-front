describe('Property Manager Page', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-token');
      win.localStorage.setItem('role', 'LANDLORD');
    });
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      // Mock departments list
      cy.intercept('GET', '**/properties/departments', {
        statusCode: 200,
        body: ['Montevideo', 'Maldonado', 'Canelones']
      }).as('getDepartments');

      cy.visit('/create-property');
    });

    it('should display create mode header and form', () => {
      cy.contains('Create New Property').should('be.visible');
      cy.get('form').should('exist');
    });

    it('should show all required form fields', () => {
      const requiredFields = [
        'name',
        'department',
        'description',
        'enterType',
        'nightPrice',
        'numberRooms',
        'numberBathrooms'
      ];

      requiredFields.forEach(field => {
        cy.get(`[name="${field}"]`).should('exist');
      });
    });

    it('should handle form submission with valid data', () => {
      cy.intercept('POST', '**/properties', {
        statusCode: 201,
        body: { id: 'new-property-id' }
      }).as('createProperty');

      // Fill form
      cy.get('[name="name"]').type('Test Property');
      cy.get('[name="department"]').select('Montevideo');
      cy.get('[name="description"]').type('Test Description');
      cy.get('[name="enterType"]').type('key');
      cy.get('[name="nightPrice"]').type('100');
      cy.get('[name="numberRooms"]').type('2');
      cy.get('[name="numberBathrooms"]').type('1');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Verify redirect after success
      cy.wait('@createProperty');
      cy.url().should('include', '/my-properties');
    });

    it('should show validation errors for empty required fields', () => {
      cy.get('button[type="submit"]').click();
      cy.get('.text-red-700').should('be.visible');
    });
  });

  describe('Update Mode', () => {
    beforeEach(() => {
      // Mock existing property data
      cy.intercept('GET', '**/properties/*', {
        statusCode: 200,
        body: {
          id: '123',
          name: 'Existing Property',
          department: 'Montevideo',
          description: 'Existing Description',
          enterType: 'key',
          nightPrice: 150,
          numberRooms: 3,
          numberBathrooms: 2,
          isPetFriendly: true,
          hasPool: false,
          hasAsador: true
        }
      }).as('getProperty');

      cy.visit('/manage-property/123');
    });

    it('should load and display existing property data', () => {
      cy.wait('@getProperty');
      cy.get('[name="name"]').should('have.value', 'Existing Property');
      cy.get('[name="description"]').should('have.value', 'Existing Description');
    });

    it('should handle update submission', () => {
      cy.intercept('PUT', '**/properties/*', {
        statusCode: 200,
        body: { message: 'Property updated' }
      }).as('updateProperty');

      // Modify some fields
      cy.get('[name="name"]').clear().type('Updated Property');
      cy.get('[name="nightPrice"]').clear().type('200');

      cy.get('button[type="submit"]').click();
      cy.wait('@updateProperty');
      cy.url().should('include', '/my-properties');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors on load', () => {
      cy.intercept('GET', '**/properties/*', {
        statusCode: 500,
        body: 'Server error'
      }).as('getPropertyError');

      cy.visit('/manage-property/123');
      cy.wait('@getPropertyError');
      cy.get('.text-red-700').should('be.visible');
    });
  });
}); 