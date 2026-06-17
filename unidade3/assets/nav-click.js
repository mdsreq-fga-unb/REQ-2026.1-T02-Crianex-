(function () {
  function init() {
    var toggles = document.querySelectorAll('.navbar .dropdown-toggle');
    if (!toggles.length) return;

    toggles.forEach(function (toggle) {
      var parent = toggle.closest('.dropdown');
      if (!parent) return;

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var isOpen = parent.classList.contains('open');

        // fecha todos os outros
        document.querySelectorAll('.navbar .dropdown.open').forEach(function (d) {
          if (d !== parent) d.classList.remove('open');
        });

        // toggle no clicado
        parent.classList.toggle('open', !isOpen);
      });
    });

    // fecha ao clicar fora da navbar
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar .dropdown')) {
        document.querySelectorAll('.navbar .dropdown.open').forEach(function (d) {
          d.classList.remove('open');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
