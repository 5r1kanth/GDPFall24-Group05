
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', function () {
        allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
        li.classList.add('active');
    });
});


const menuBar = document.querySelector('.bx-menu'); 
const sidebar = document.getElementById('sidebar');

if (menuBar && sidebar) {
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    });

    function adjustSidebar() {
        if (window.innerWidth <= 576) {
            sidebar.classList.add('hide');
        } else {
            sidebar.classList.remove('hide');
        }
    }

    window.addEventListener('load', adjustSidebar);
    window.addEventListener('resize', adjustSidebar);
}


const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

if (searchButton && searchForm && searchButtonIcon) {
    searchButton.addEventListener('click', function (e) {
        if (window.innerWidth < 768) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            searchButtonIcon.classList.toggle('bx-x', searchForm.classList.contains('show'));
            searchButtonIcon.classList.toggle('bx-search', !searchForm.classList.contains('show'));
        }
    });
}


const switchMode = document.getElementById('switch-mode');

if (switchMode) {
    switchMode.addEventListener('change', function () {
        document.body.classList.toggle('dark', this.checked);
    });
}


const notificationIcon = document.getElementById('notificationIcon');
const notificationMenu = document.getElementById('notificationMenu');

if (notificationIcon && notificationMenu) {
    notificationIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        notificationMenu.classList.toggle('show');
        profileMenu.classList.remove('show');
    });
}


const profileIcon = document.getElementById('profileIcon');
const profileMenu = document.getElementById('profileMenu');

if (profileIcon && profileMenu) {
    profileIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        profileMenu.classList.toggle('show');
        notificationMenu.classList.remove('show');
    });
}


window.addEventListener('click', function (e) {
    if (!e.target.closest('.notification') && notificationMenu) {
        notificationMenu.classList.remove('show');
    }
    if (!e.target.closest('.profile') && profileMenu) {
        profileMenu.classList.remove('show');
    }
});


function toggleMenu(menuId) {
    var menu = document.getElementById(menuId);
    var allMenus = document.querySelectorAll('.menu');

    allMenus.forEach(m => {
        if (m !== menu) {
            m.style.display = 'none';
        }
    });

    if (menu) {
        menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.menu').forEach(menu => menu.style.display = 'none');
});
