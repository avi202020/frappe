context('Form', () => {
	beforeEach(() => {
		cy.login();
		cy.visit('/desk');
	});
	before(() => {
		cy.login();
		cy.visit('/desk');
		cy.window().its('frappe').then(frappe => {
			frappe.call("frappe.tests.ui_test_helpers.create_contact_records");
		});
	});
	it('create a new form', () => {
		cy.visit('/desk#Form/ToDo/New ToDo 1');
		cy.fill_field('description', 'this is a test todo', 'Text Editor').blur();
		cy.get('.page-title').should('contain', 'Not Saved');
		cy.get('.primary-action').click();
		cy.visit('/desk#List/ToDo');
		cy.location('hash').should('eq', '#List/ToDo/List');
		cy.get('.list-row').should('contain', 'this is a test todo');
	});
	it('navigates between documents with child table list filters applied', () => {
		cy.visit('/desk#List/Contact');
		cy.get('.tag-filters-area .btn:contains("Add Filter")').click();
		cy.get('.fieldname-select-area').should('exist');
		cy.get('.fieldname-select-area input').type('Number{enter}', { force: true });
		cy.get('.filter-field .input-with-feedback.form-control').type('123', { force: true });
		cy.get('.filter-box .btn:contains("Apply")').click({ force: true });
		cy.visit('/desk#Form/Contact/Test Form Contact 3');
		cy.get('.prev-doc').click();
		cy.get('.msgprint-dialog .modal-body').contains('No further records').should('be.visible');
		cy.get('.modal-backdrop').click();
		cy.get('.next-doc').click();
		cy.contains('Test Form Contact 2').should('not.exist');
		cy.get('.page-title .title-text').should('contain', 'Test Form Contact 1');
		cy.visit('/desk#List/Contact');
		cy.get('.clear-filters.btn').click();
	});
});
