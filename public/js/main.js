window.addEventListener('scroll', function () {
    var header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.remove('header-transparent');
      header.classList.add('header-blurry');
    } else {
      header.classList.remove('header-blurry');
      header.classList.add('header-transparent');
    }
  });



document.addEventListener('DOMContentLoaded', function() {
    const eventItems = document.querySelectorAll('.event-item');
    
    eventItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        // Toggle active class
        this.classList.toggle('active');
        
        // Close other open items
        eventItems.forEach(otherItem => {
          if (otherItem !== this && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            let collapsibleElement = otherItem.querySelector('.collapse');
            if (collapsibleElement) {
              bootstrap.Collapse.getInstance(collapsibleElement).hide();
            }
          }
        });
      });
    });
  });