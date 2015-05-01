angular.module('febworms').directive('febwormsEditPaletteCategories', function () {
  return {
    templateUrl: '../components/febworms/edit/palette/categories/categories.tmpl.html',
    require: '^febwormsEditPalette',
    scope: {
      category: "=?"
    },
    controller: 'febwormsEditPaletteCategoriesController'
  };
});
