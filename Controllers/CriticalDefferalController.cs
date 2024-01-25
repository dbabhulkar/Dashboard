using Microsoft.AspNetCore.Mvc;

namespace Dashboard.Controllers
{
    public class CriticalDefferalController : Controller
    {
        // GET: Defferal
        public IActionResult Index()
        {
            return View();
        }


        // GET: Defferal/Details/5
        public IActionResult Details(int id)
        {
            return View();
        }

        // GET: Defferal/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Defferal/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(IFormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: Defferal/Edit/5
        public IActionResult Edit(int id)
        {
            return View();
        }

        // POST: Defferal/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: Defferal/Delete/5
        public IActionResult Delete(int id)
        {
            return View();
        }

        // POST: Defferal/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
