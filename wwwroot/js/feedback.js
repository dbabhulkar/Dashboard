$(document).ready(function () {
    $('.ui__label').click(function () {
        debugger;
        //$('.rating__label').removeClass('MyClass');
        //this.classList.add('MyClass');
        //document.getElementById("<%= hdnUI.ClientID %>").value 
        var hdnUi = this.children[1].textContent;
        var hdnId = "hdn" + this.parentElement.id;
        document.getElementById(hdnId).value = hdnUi;
        //  $(".hdnUI").value = this.children[1].textContent;
    })
    $('.Perfomance__label').click(function () {
        debugger;
        //$('.rating__label').removeClass('MyClass');
        //this.classList.add('MyClass');
        //document.getElementById("<%= hdnUI2.ClientID %>").value
        var hdnUi = this.children[1].textContent;
        var hdnId = "hdn" + this.parentElement.id;
        document.getElementById(hdnId).value = hdnUi;
        //  $(".hdnUI").value = this.children[1].textContent;
    })
    $('.Userfreindly__label').click(function () {
        var hdnUi = this.children[1].textContent;
        var hdnId = "hdn" + this.parentElement.id;
        document.getElementById(hdnId).value = hdnUi;
    })
    $('.Experience__label').click(function () {
        var hdnUi = this.children[1].textContent;
        var hdnId = "hdn" + this.parentElement.id;
        document.getElementById(hdnId).value = hdnUi;
    })
    $('.Revelvance__label').click(function () {
        var hdnUi = this.children[1].textContent;
        var hdnId = "hdn" + this.parentElement.id;
        document.getElementById(hdnId).value = hdnUi;
    })
});

$('#btnsubmit_feedback').on("click", function () {

    //var UI = document.getElementById("<%= hdnUI.ClientID %>").value;
    //var UI2 = document.getElementById("<%= hdnUI2.ClientID %>").value;

    debugger;
    var strValidate = '';
    var UI = $('#hdnUI').val();
    var Performance = $('#hdnPerformance').val();
    var Userfreindly = $('#hdnUserfreindly').val();
    var Experience = $('#hdnExperience').val();
    var Revelvance = $('#hdnRevelvance').val();
    if (UI == '') {
        if (strValidate == '') {
            strValidate += '- Please Rate UserInterface';
        }
        else {
            strValidate += ', UserInterface';
        }
    }
    if (Performance == '') {
        if (strValidate == '') {
            strValidate += '- Please Rate Performance';
        }
        else {
            strValidate += ', Performance';
        }
    }
    if (Userfreindly == '') {
        if (strValidate == '') {
            strValidate += '- Please Rate Userfreindly';
        }
        else {
            strValidate += ', Userfreindly';
        }
    }
    if (Experience == '') {
        if (strValidate == '') {
            strValidate += '- Please Rate Experience';
        }
        else {
            strValidate += ', Experience';
        }
    }
    if (Revelvance == '') {
        if (strValidate == '') {
            strValidate += '- Please Rate Revelvance';
        }
        else {
            strValidate += ', Revelvance';
        }
    }



    if (strValidate != '') {



        toastr.error(strValidate);



        return false;
    }
    else {




        var UI = $('#hdnUI').val();
        var Performance = $('#hdnPerformance').val();
        var Userfreindly = $('#hdnUserfreindly').val();
        var Experience = $('#hdnExperience').val();
        var Revelvance = $('#hdnRevelvance').val();

        var Modules = $('#ddl_Modules').val();
        var Remarks = $('#txtRemarks').val();

        var ArrUI = UI.split('—');
        var ArrPerfomance = Performance;
        var ArrUserfreindly = Userfreindly;
        var ArrExperience = Experience;
        var ArrRevelvance = Revelvance;

        UI = ArrUI;
        Performance = ArrPerfomance;
        Userfreindly = ArrUserfreindly;
        Experience = ArrExperience;
        Revelvance = ArrRevelvance;

        formData = new FormData();
        formData.append('UI', UI);
        formData.append('Performance', Performance);
        formData.append('Userfreindly', Userfreindly);
        formData.append('Experience', Experience);
        formData.append('Revelvance', Revelvance);
        formData.append('Remarks', Remarks);
        formData.append('Modules', Modules);

        //const obj = {};

        //obj.UI = UI;
        //obj.Performance = Performance;
        //obj.Userfreindly = Userfreindly;
        //obj.Experience = Experience;
        //obj.Revelvance = Revelvance;
        //obj.Remarks = Remarks;
        //obj.Modules = Modules;
        $.ajax({
            type: "POST",
            url: "/Home/SaveFeedBack",
            data: formData,
            contentType: false,
            dataType: "JSON",
            async: false,
            processData: false,
            success: function (data) {
                if (data != null) {
                    $('#hdnUI').val('').text('');
                    $('#hdnPerformance').val('').text('');
                    $('#hdnUserfreindly').val('').text('');
                    $('#hdnExperience').val('').text('');
                    $('#hdnRevelvance').val('').text('');
                    window.location.href = "../Home/Dashboard"
                }
            },
            failure: function () {

            }
        });
    }
});


window.addEventListener("DOMContentLoaded", () => {
    debugger;
    const starRating = new StarRating("#UI");
    const performanceRating = new PerformanceRating("#Performance");
    const userfreindlyRating = new UserfreindlyRating("#Userfreindly");
    const experienceRating = new ExperienceRating("#Experience");
    const revelvanceRating = new RevelvanceRating("#Revelvance");
});

class StarRating {

    constructor(qs) {
        this.ratings = [
            { id: 1, name: "Terrible" },
            { id: 2, name: "Bad" },
            { id: 3, name: "OK" },
            { id: 4, name: "Good" },
            { id: 5, name: "Excellent" }
        ];
        this.rating = null;

        this.el = document.querySelector(qs);

        this.init();
    }
    init() {
        this.el?.addEventListener("change", this.updateRating.bind(this));

        // stop Firefox from preserving form data between refreshes
        try {
            this.el?.reset();
        } catch (err) {
            console.error("Element isn’t a form.");
        }
    }
    updateRating(e) {
        debugger;
        // clear animation delays
        Array.from(this.el.querySelectorAll(`[for*="ui"]`)).forEach(el => {
            el.className = "rating__label";
        });

        const ratingObject = this.ratings.find(r => r.id === +e.target.value);
        const prevRatingID = this.rating?.id || 0;

        let delay = 0;
        this.rating = ratingObject;
        this.ratings.forEach(rating => {
            const { id } = rating;

            // add the delays
            const ratingLabel = this.el.querySelector(`[for="rating-${id}"]`);

            if (id > prevRatingID + 1 && id <= this.rating.id) {
                ++delay;
                ratingLabel.classList.add(`rating__label--delay${delay}`);
            }

            // hide ratings to not read, show the one to read
            const ratingTextEl = this.el.querySelector(`[data-rating="${id}"]`);

            if (this.rating.id !== id)
                ratingTextEl.setAttribute("hidden", true);
            else
                ratingTextEl.removeAttribute("hidden");
        });
    }
}

class PerformanceRating {

    constructor(qs) {
        this.ratings = [
            { id: 1, name: "Terrible2" },
            { id: 2, name: "Bad2" },
            { id: 3, name: "OK2" },
            { id: 4, name: "Good2" },
            { id: 5, name: "Excellent2" }
        ];
        this.rating = null;

        this.el = document.querySelector(qs);

        this.init();
    }
    init() {
        this.el?.addEventListener("change", this.performanceRating.bind(this));

        // stop Firefox from preserving form data between refreshes
        try {
            this.el?.reset();
        } catch (err) {
            console.error("Element isn’t a form.");
        }
    }
    performanceRating(e) {
        debugger;
        // clear animation delays
        Array.from(this.el.querySelectorAll(`[for*="performance"]`)).forEach(el => {
            el.className = "rating__label";
        });

        const ratingObject = this.ratings.find(r => r.id === +e.target.value);
        const prevRatingID = this.rating?.id || 0;

        let delay = 0;
        this.rating = ratingObject;
        this.ratings.forEach(rating => {
            const { id } = rating;

            // add the delays
            const ratingLabel = this.el.querySelector(`[for="Perfomance-${id}"]`);

            if (id > prevRatingID + 1 && id <= this.rating.id) {
                ++delay;
                ratingLabel.classList.add(`rating__label--delay${delay}`);
            }

            // hide ratings to not read, show the one to read
            const ratingTextEl = this.el.querySelector(`[data-rating="${id}"]`);

            if (this.rating.id !== id)
                ratingTextEl.setAttribute("hidden", true);
            else
                ratingTextEl.removeAttribute("hidden");
        });
    }
}

class UserfreindlyRating {

    constructor(qs) {
        this.ratings = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
        ];
        this.rating = null;

        this.el = document.querySelector(qs);

        this.init();
    }
    init() {
        this.el?.addEventListener("change", this.userfreindlyRating.bind(this));

        // stop Firefox from preserving form data between refreshes
        try {
            this.el?.reset();
        } catch (err) {
            console.error("Element isn’t a form.");
        }
    }
    userfreindlyRating(e) {
        debugger;
        // clear animation delays
        Array.from(this.el.querySelectorAll(`[for*="userfreindly"]`)).forEach(el => {
            el.className = "rating__label";
        });

        const ratingObject = this.ratings.find(r => r.id === +e.target.value);
        const prevRatingID = this.rating?.id || 0;

        let delay = 0;
        this.rating = ratingObject;
        this.ratings.forEach(rating => {
            const { id } = rating;

            // add the delays
            const ratingLabel = this.el.querySelector(`[for="Userfreindly-${id}"]`);

            if (id > prevRatingID + 1 && id <= this.rating.id) {
                ++delay;
                ratingLabel.classList.add(`rating__label--delay${delay}`);
            }

            // hide ratings to not read, show the one to read
            const ratingTextEl = this.el.querySelector(`[data-rating="${id}"]`);

            if (this.rating.id !== id)
                ratingTextEl.setAttribute("hidden", true);
            else
                ratingTextEl.removeAttribute("hidden");
        });
    }
}

class ExperienceRating {

    constructor(qs) {
        this.ratings = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
        ];
        this.rating = null;

        this.el = document.querySelector(qs);

        this.init();
    }
    init() {
        this.el?.addEventListener("change", this.experienceRating.bind(this));

        // stop Firefox from preserving form data between refreshes
        try {
            this.el?.reset();
        } catch (err) {
            console.error("Element isn’t a form.");
        }
    }
    experienceRating(e) {
        debugger;
        // clear animation delays
        Array.from(this.el.querySelectorAll(`[for*="experience"]`)).forEach(el => {
            el.className = "rating__label";
        });

        const ratingObject = this.ratings.find(r => r.id === +e.target.value);
        const prevRatingID = this.rating?.id || 0;

        let delay = 0;
        this.rating = ratingObject;
        this.ratings.forEach(rating => {
            const { id } = rating;

            // add the delays
            const ratingLabel = this.el.querySelector(`[for="Experience-${id}"]`);

            if (id > prevRatingID + 1 && id <= this.rating.id) {
                ++delay;
                ratingLabel.classList.add(`rating__label--delay${delay}`);
            }

            // hide ratings to not read, show the one to read
            const ratingTextEl = this.el.querySelector(`[data-rating="${id}"]`);

            if (this.rating.id !== id)
                ratingTextEl.setAttribute("hidden", true);
            else
                ratingTextEl.removeAttribute("hidden");
        });
    }
}

class RevelvanceRating {

    constructor(qs) {
        this.ratings = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
        ];
        this.rating = null;

        this.el = document.querySelector(qs);

        this.init();
    }
    init() {
        this.el?.addEventListener("change", this.revelvanceRating.bind(this));

        // stop Firefox from preserving form data between refreshes
        try {
            this.el?.reset();
        } catch (err) {
            console.error("Element isn’t a form.");
        }
    }
    revelvanceRating(e) {
        debugger;
        // clear animation delays
        Array.from(this.el.querySelectorAll(`[for*="revelvance"]`)).forEach(el => {
            el.className = "rating__label";
        });

        const ratingObject = this.ratings.find(r => r.id === +e.target.value);
        const prevRatingID = this.rating?.id || 0;

        let delay = 0;
        this.rating = ratingObject;
        this.ratings.forEach(rating => {
            const { id } = rating;

            // add the delays
            const ratingLabel = this.el.querySelector(`[for="Revelvance-${id}"]`);

            if (id > prevRatingID + 1 && id <= this.rating.id) {
                ++delay;
                ratingLabel.classList.add(`rating__label--delay${delay}`);
            }

            // hide ratings to not read, show the one to read
            const ratingTextEl = this.el.querySelector(`[data-rating="${id}"]`);

            if (this.rating.id !== id)
                ratingTextEl.setAttribute("hidden", true);
            else
                ratingTextEl.removeAttribute("hidden");
        });
    }
}