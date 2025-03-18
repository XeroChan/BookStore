using BookStore.Api.Entities;

namespace BookStore.Api.Repositories;

public class InMemBooksRepository : IBooksRepository
// repo separates data from app logic
{
    private readonly List<Book> books = new() //not thread safe
    {
        new Book()
        {
            Id = 1,
            Title = "All Good People Here: A Novel",
            AuthorId = 1,
            Publisher = "Random House Publishing Group",
            Genre = "Mystery fiction",
            Description = "You can't ever know for sure what happens behind closed doors. Everyone from Wakarusa, Indiana, remembers the infamous case of January Jacobs, who was discovered in a ditch hours after her family awoke to find her gone. Margot Davies was six at the time, the same age as January—and they were next-door neighbors. In the twenty years since, Margot has grown up, moved away, and become a big-city journalist. But she's always been haunted by the feeling that it could've been her. And the worst part is, January's killer has never been brought to justice. When Margot returns home to help care for her uncle after he is diagnosed with early-onset dementia, she feels like she's walked into a time capsule. Wakarusa is exactly how she remembers—genial, stifled, secretive. Then news breaks about five-year-old Natalie Clark from the next town over, who's gone missing under circumstances eerily similar to January's. With all the old feelings rushing back, Margot vows to find Natalie and to solve January's murder once and for all. But the police, Natalie's family, the townspeople—they all seem to be hiding something. And the deeper Margot digs into Natalie's disappearance, the more resistance she encounters, and the colder January's case feels. Could January's killer still be out there? Is it the same person who took Natalie? And what will it cost to finally discover what truly happened that night twenty years ago? Twisty, chilling, and intense, 'All Good People Here' is a searing tale that explores the depths of human actions when they believe no one is watching.",
            ISBN = "9780593496497",
            PagesCount = 336,
            Price = 18.00M,
            ReleaseDate = new DateTime(2023,12,26),
            ImageUri = "https://placehold.co/100",
            DateAdded = new DateTime(2023,12,26)
        },
        new Book()
        {
            Id = 2,
            Title = "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
            AuthorId = 2,
            Publisher = "Penguin Publishing Group",
            Genre = "Self-help book",
            Description = "Tiny Changes, Remarkable ResultsNo matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.If you're having trouble changing your habits, the problem isn't you. The problem is your system. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change. You do not rise to the level of your goals. You fall to the level of your systems. Here, you'll get a proven system that can take you to new heights.Clear is known for his ability to distill complex topics into simple behaviors that can be easily applied to daily life and work. Here, he draws on the most proven ideas from biology, psychology, and neuroscience to create an easy-to-understand guide for making good habits inevitable and bad habits impossible. Along the way, readers will be inspired and entertained with true stories from Olympic gold medalists, award-winning artists, business leaders, life-saving physicians, and star comedians who have used the science of small habits to master their craft and vault to the top of their field.Learn how to:make time for new habits (even when life gets crazy);overcome a lack of motivation and willpower;design your environment to make success easier;get back on track when you fall off course;...and much more.Atomic Habits will reshape the way you think about progress and success, and give you the tools and strategies you need to transform your habits—whether you are a team looking to win a championship, an organization hoping to redefine an industry, or simply an individual who wishes to quit smoking, lose weight, reduce stress, or achieve any other goal.",
            ISBN = "9780735211292",
            PagesCount = 320,
            Price = 22.99M,
            ReleaseDate = new DateTime(2018,10,16),
            ImageUri = "https://placehold.co/100",
            DateAdded = new DateTime(2023,12,26)
        },
        new Book()
        {
            Id = 3,
            Title = "In the Lives of Puppets (B&N Exclusive Edition)",
            AuthorId = 2,
            Publisher = "Tom Doherty Associates",
            Genre = "Fantasy",
            Description = "In a strange little home built into the branches of a grove of trees, live three robots—fatherly inventor android Giovanni Lawson, a pleasantly sadistic nurse machine, and a small vacuum desperate for love and attention. Victor Lawson, a human, lives there too. They're a family, hidden and safe.The day Vic salvages and repairs an unfamiliar android labelled “HAP,” he learns of a shared dark past between Hap and Gio - a past spent hunting humans.When Hap unwittingly alerts robots from Gio's former life to their whereabouts, the family is no longer hidden and safe. Gio is captured and taken back to his old laboratory in the City of Electric Dreams. So together, the rest of Vic's assembled family must journey across an unforgiving and otherworldly country to rescue Gio from decommission, or worse, reprogramming.Along the way to save Gio, amid conflicted feelings of betrayal and affection for Hap, Vic must decide for himself: Can he accept love with strings attached?Inspired by Carlo Collodi's The Adventures of Pinocchio, and like Swiss Family Robinson meets Wall-E, In the Lives of Puppets is a masterful stand-alone fantasy adventure from the beloved author who brought you The House in the Cerulean Sea and Under the Whispering Door.",
            ISBN = "9781250889539",
            PagesCount = 432,
            Price = 14.49M,
            ReleaseDate = new DateTime(2023,4,25),
            ImageUri = "https://placehold.co/100",
            DateAdded = new DateTime(2023,12,26)
        }
    };

    public async Task<IEnumerable<Book>> GetAllAsync()
    {
        return await Task.FromResult(books); // task created from result for in mem approach
    }
    public async Task<Book?> GetAsync(int id) // can return null
    {
        return await Task.FromResult(books.Find(book => book.Id == id));
    }
    public async Task CreateAsync(Book book)
    {
        book.Id = books.Max(book => book.Id) + 1; // catch max book id and increment
        books.Add(book);

        await Task.CompletedTask; // nothing to wait for after its complete
    }
    public async Task UpdateAsync(Book updatedBook)
    {
        var index = books.FindIndex(book => book.Id == updatedBook.Id);
        books[index] = updatedBook;

        await Task.CompletedTask;
    }
    public async Task DeleteAsync(int id)
    {
        var index = books.FindIndex(book => book.Id == id);
        books.RemoveAt(index);

        await Task.CompletedTask;
    }
}