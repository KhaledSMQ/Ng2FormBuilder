import { NgFormBuilderPage } from './app.po';

describe('ng-form-builder App', () => {
  let page: NgFormBuilderPage;

  beforeEach(() => {
    page = new NgFormBuilderPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
