describe('Rating Component', () => {
  beforeEach(() => {
    // Set up authentication
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-jwt-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem('role', 'LANDLORD');
    });
    cy.visit('/rating/123');
  });

  describe('UI Elements', () => {
    it('should display rating form with all elements', () => {
      // Verify title
      cy.contains('h1', 'Calificar tu estadia').should('be.visible');

      // Verify star rating exists
      cy.get('button svg').should('have.length', 5); // 5 star buttons

      // Verify comment field exists
      cy.get('textarea#comments').should('exist');

      // Verify submit button exists
      cy.contains('button', 'Submit Rating').should('be.visible');
    });

    it('should handle star rating interaction', () => {
      // Initially all stars should be active (default rating is 5)
      cy.get('button svg').each(($star) => {
        cy.wrap($star).parent().should('have.class', 'text-yellow-400');
      });

      // Click on the third star
      cy.get('button svg').eq(2).click();

      // First three stars should be active, last two inactive
      cy.get('button svg').each(($star, index) => {
        const expectedClass = index <= 2 ? 'text-yellow-400' : 'text-gray-300';
        cy.wrap($star).parent().should('have.class', expectedClass);
      });
    });

    it('should handle star hover states', () => {
      // Hover over the third star
      cy.get('button svg').eq(2).trigger('mouseenter');

      // First three stars should be active, last two inactive
      cy.get('button svg').each(($star, index) => {
        const expectedClass = index <= 2 ? 'text-yellow-400' : 'text-gray-300';
        cy.wrap($star).parent().should('have.class', expectedClass);
      });

      // Move mouse away
      cy.get('button svg').eq(2).trigger('mouseleave');

      // Should return to showing all stars (default rating 5)
      cy.get('button svg').each(($star) => {
        cy.wrap($star).parent().should('have.class', 'text-yellow-400');
      });
    });
  });

  describe('Form Validation', () => {
    it('should require comments', () => {
      // Try to submit without comments
      cy.contains('button', 'Submit Rating').click();

      // Should show error message
      cy.contains('Please provide a comment').should('be.visible');
    });

    it('should show loading state during submission', () => {
      cy.intercept('POST', '**/rental/requests/*/ratings', {
        delay: 1000,
        statusCode: 201,
        body: { message: 'Rating submitted successfully' }
      }).as('submitRating');

      // Fill and submit form
      cy.get('textarea#comments').type('Great experience!');
      cy.contains('button', 'Submit Rating').click();

      // Check loading state
      cy.contains('Submitting...').should('be.visible');
      cy.get('.animate-spin').should('be.visible');

      cy.wait('@submitRating');
    });

    it('should submit rating successfully', () => {
      cy.intercept('POST', '**/rental/requests/*/ratings', {
        statusCode: 201,
        body: { message: 'Rating submitted successfully' }
      }).as('submitRating');

      // Fill and submit form
      cy.get('textarea#comments').type('Great experience!');
      cy.contains('button', 'Submit Rating').click();

      // Wait for submission and verify redirect
      cy.wait('@submitRating');
      cy.url().should('include', '/userrequests');
    });

    it('should handle submission errors', () => {
      cy.intercept('POST', '**/rental/requests/*/ratings', {
        statusCode: 500,
        body: { message: 'Server error' }
      }).as('submitRatingError');

      // Fill and submit form
      cy.get('textarea#comments').type('Great experience!');
      cy.contains('button', 'Submit Rating').click();

      // Verify error message
      cy.wait('@submitRatingError');
    });
  });
}); 