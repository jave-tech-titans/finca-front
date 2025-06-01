describe('Owner Requests Page', () => {
  beforeEach(() => {
    // Mock the authentication state
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'LANDLORD');
    });
  });

  describe('UI Elements', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/rental/owner/requests**', {
        statusCode: 200,
        body: []
      }).as('getRequests');
      cy.visit('/ownerrequests');
      cy.wait('@getRequests');
    });

    it('should display the page header and description', () => {
      cy.get('[data-cy="page-title"]').should('contain', 'Solicitudes de alquiler');
      cy.get('[data-cy="page-description"]').should('contain', 'Maneja tus solicitudes de alquiler');
    });

    it('should show loading state initially', () => {
      cy.intercept('GET', '**/rental/owner/requests**', {
        delay: 1000,
        statusCode: 200,
        body: []
      }).as('delayedRequests');
      
      cy.visit('/ownerrequests');
      cy.get('[data-cy="loading-spinner"]').should('be.visible');
      cy.wait('@delayedRequests');
    });

    it('should display empty state message when no requests exist', () => {
      cy.get('[data-cy="empty-state"]').should('be.visible')
        .and('contain', 'No se encontraron solicitudes de alquiler');
    });

    it('should display table headers in correct order', () => {
      cy.intercept('GET', '**/rental/owner/requests**', {
        statusCode: 200,
        body: [{ 
          id: '1',
          propertyName: 'Test Property',
          userName: 'Test User',
          startDate: '2024-03-01',
          endDate: '2024-03-05',
          price: 100,
          status: 'REQUESTED'
        }]
      }).as('getRequestsWithData');

      cy.visit('/ownerrequests');
      cy.wait('@getRequestsWithData');

      const expectedHeaders = [
        { cy: 'header-property', text: 'Propiedad' },
        { cy: 'header-user', text: 'Usuario' },
        { cy: 'header-dates', text: 'Fechas' },
        { cy: 'header-price', text: 'Precio' },
        { cy: 'header-status', text: 'Estado' },
        { cy: 'header-actions', text: 'Acciones' }
      ];

      expectedHeaders.forEach(header => {
        cy.get(`[data-cy="${header.cy}"]`).should('contain', header.text);
      });
    });
  });

  describe('Request Actions', () => {
    beforeEach(() => {
      // Mock requests with different statuses
      cy.intercept('GET', '**/rental/owner/requests**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            propertyName: 'Test Property 1',
            userName: 'Test User 1',
            startDate: '2024-03-01',
            endDate: '2024-03-05',
            price: 100,
            status: 'REQUESTED'
          },
          {
            id: '2',
            propertyName: 'Test Property 2',
            userName: 'Test User 2',
            startDate: '2024-03-10',
            endDate: '2024-03-15',
            price: 200,
            status: 'COMPLETED'
          }
        ]
      }).as('getRequests');

      cy.visit('/ownerrequests');
      cy.wait('@getRequests');
    });

    it('should show accept/deny buttons only for REQUESTED status', () => {
      cy.get('[data-cy="request-row-1"]').within(() => {
        cy.get('[data-cy="accept-button-1"]').should('be.visible');
        cy.get('[data-cy="deny-button-1"]').should('be.visible');
        cy.get('[data-cy="rate-button-1"]').should('not.exist');
      });
    });

    it('should show rate button only for COMPLETED status', () => {
      cy.get('[data-cy="request-row-2"]').within(() => {
        cy.get('[data-cy="rate-button-2"]').should('be.visible');
        cy.get('[data-cy="accept-button-2"]').should('not.exist');
        cy.get('[data-cy="deny-button-2"]').should('not.exist');
      });
    });

    it('should handle accept request action', () => {
      cy.intercept('PATCH', '**/rental/1/accept', {
        statusCode: 200,
        body: 'Request accepted'
      }).as('acceptRequest');

      cy.get('[data-cy="accept-button-1"]').click();
      cy.wait('@acceptRequest');
      
      cy.get('[data-cy="success-message"]')
        .should('be.visible')
        .and('contain', 'Request accepted successfully');
    });

    it('should handle deny request action', () => {
      cy.intercept('PATCH', '**/rental/1/deny', {
        statusCode: 200,
        body: 'Request denied'
      }).as('denyRequest');

      cy.get('[data-cy="deny-button-1"]').click();
      cy.wait('@denyRequest');
      
      cy.get('[data-cy="success-message"]')
        .should('be.visible')
        .and('contain', 'Request denied successfully');
    });

    it('should navigate to rating page when clicking rate button', () => {
      cy.get('[data-cy="rate-button-2"]').click();
      cy.url().should('include', '/rating/2');
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API request fails', () => {
      cy.intercept('GET', '**/rental/owner/requests**', {
        statusCode: 500,
        body: 'Server error'
      }).as('getRequestsError');

      cy.visit('/ownerrequests');
      cy.wait('@getRequestsError');
      cy.get('[data-cy="error-message"]').should('be.visible');
    });

    it('should display error message when accept action fails', () => {
      cy.intercept('GET', '**/rental/owner/requests**', {
        statusCode: 200,
        body: [{
          id: '1',
          propertyName: 'Test Property 1',
          userName: 'Test User 1',
          startDate: '2024-03-01',
          endDate: '2024-03-05',
          price: 100,
          status: 'REQUESTED'
        }]
      }).as('getRequests');

      cy.intercept('PATCH', '**/rental/1/accept', {
        statusCode: 500,
        body: 'Failed to accept request'
      }).as('acceptRequestError');

      cy.visit('/ownerrequests');
      cy.wait('@getRequests');

      cy.get('[data-cy="accept-button-1"]').click();
      cy.wait('@acceptRequestError');
      cy.get('[data-cy="error-message"]').should('be.visible');
    });
  });

  describe('Status Display', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/rental/owner/requests**', {
        statusCode: 200,
        body: [
          { 
            id: '1', 
            status: 'REQUESTED', 
            propertyName: 'Property 1',
            userName: 'User 1',
            startDate: '2024-03-01',
            endDate: '2024-03-05',
            price: 100
          },
          { 
            id: '2', 
            status: 'COMPLETED', 
            propertyName: 'Property 2',
            userName: 'User 2',
            startDate: '2024-03-10',
            endDate: '2024-03-15',
            price: 200
          },
          { 
            id: '3', 
            status: 'DENIED', 
            propertyName: 'Property 3',
            userName: 'User 3',
            startDate: '2024-03-20',
            endDate: '2024-03-25',
            price: 300
          }
        ]
      }).as('getRequests');

      cy.visit('/ownerrequests');
      cy.wait('@getRequests');
    });

    it('should apply correct color classes for different statuses', () => {
      // Check REQUESTED status styling
      cy.get('[data-cy="status-badge-1"]')
        .should('have.class', 'bg-yellow-100')
        .and('have.class', 'text-yellow-800');

      // Check COMPLETED status styling
      cy.get('[data-cy="status-badge-2"]')
        .should('have.class', 'bg-green-100')
        .and('have.class', 'text-green-800');

      // Check DENIED status styling
      cy.get('[data-cy="status-badge-3"]')
        .should('have.class', 'bg-red-100')
        .and('have.class', 'text-red-800');
    });
  });
}); 