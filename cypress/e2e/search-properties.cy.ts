describe('Search Properties Page', () => {
  beforeEach(() => {
    // Set up authentication
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'CLIENT');
    });

    cy.visit('/properties');
  });

  describe('Search and Filters', () => {
    beforeEach(() => {
      // Mock initial properties
      cy.intercept('GET', '**/properties**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Beach House',
            department: 'Maldonado',
            price: 200,
            description: 'Beautiful beach house',
            rating: 4.5,
            imageUrl: 'pic1.jpg'
          },
          {
            id: '2',
            name: 'City Apartment',
            department: 'Montevideo',
            price: 100,
            description: 'Modern city apartment',
            rating: 4.0,
            imageUrl: 'pic2.jpg'
          }
        ]
      }).as('getProperties');
    });

    it('should display search filters', () => {
      cy.get('#name').should('exist');
      cy.get('#department').should('exist');
      cy.get('#minPrice').should('exist');
      cy.get('#maxPrice').should('exist');
      cy.get('#nRooms').should('exist');
      cy.get('#nPeople').should('exist');
    });

    it('should filter properties by name', () => {
      cy.intercept('GET', '**/properties**', {
        statusCode: 200,
        body: [{
          id: '1',
          name: 'Beach House',
          department: 'Maldonado',
          price: 200,
          rating: 4.5,
          imageUrl: 'pic1.jpg'
        }]
      }).as('filterByName');

      cy.get('#name').type('Beach');
      cy.wait('@filterByName');
      cy.contains('Beach House').should('be.visible');
      cy.contains('City Apartment').should('not.exist');
    });

    it('should filter properties by department', () => {
      cy.intercept('GET', '**/properties**', {
        statusCode: 200,
        body: [{
          id: '1',
          name: 'Beach House',
          department: 'Maldonado',
          price: 200,
          rating: 4.5,
          imageUrl: 'pic1.jpg'
        }]
      }).as('filterByDepartment');

      cy.get('#department').type('Maldonado');
      cy.wait('@filterByDepartment');
      cy.contains('Beach House').should('be.visible');
      cy.contains('City Apartment').should('not.exist');
    });

    it('should filter properties by price range', () => {
      cy.intercept('GET', '**/properties**', {
        statusCode: 200,
        body: [{
          id: '2',
          name: 'City Apartment',
          department: 'Montevideo',
          price: 100,
          rating: 4.0,
          imageUrl: 'pic2.jpg'
        }]
      }).as('filterByPrice');

      cy.get('#minPrice').type('50');
      cy.get('#maxPrice').type('150');
      cy.wait('@filterByPrice');
      cy.contains('City Apartment').should('be.visible');
      cy.contains('Beach House').should('not.exist');
    });
  });
}); 