/** 
 *  Student Name: Snehal Sinha
    File Name: scripts.js
    Date: February 19, 2026 
 */
    //hamburger menu function

    function hamburger(){
        var menu = document.getElementById("menu-links");
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
        }
    }