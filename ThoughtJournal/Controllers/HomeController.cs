using InertiaCore;
using Microsoft.AspNetCore.Mvc;

namespace ThoughtJournal.Controllers;


[Route("/")]
public class HomeController : Controller
{
    public async Task<Response> Index()
    {
        return Inertia.Render("Index");
    }
}
