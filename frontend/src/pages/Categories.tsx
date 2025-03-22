import React from "react";

export default function Categories() {
  let Category: Array<string> = [
    "Featured Tasks",
    "Handyman",
    "Moving Services",
    "Furniture Assembly",
    "Mounting & Installation",
    "Cleaning",
    "Shopping + Delivery",
    "IKEA Services",
    "Yardwork Services",
    "Holidays",
    "Winter Tasks",
    "Personal Assistant",
    "Baby Prep",
    "Virtual & Online Tasks",
    "Office Services",
    "Contactless Tasks",
  ];

  let SubCat: Array<Array<string>> = [
    [
      "Furniture Assembly",
      "Home Repairs",
      "Help Moving",
      "Heavy Lifting",
      "Home Cleaning",
      "Spring Cleaning",
      "Personal Assistant",
      "Hang Art, Mirror & Decor",
      "Yard Work Services",
    ],
    [
      "Door, Cabinet, & Furniture Repair",
      "Appliance Installation & Repairs",
      "Furniture Assembly",
      "TV Mounting",
      "Drywall Repair Service",
      "Flooring & Tiling Help",
      "Electrical Help",
      "Sealing & Caulking",
      "Plumbing",
    ],
    [
      "Help Moving",
      "Truck Assisted Help Moving",
      "Packing Services & Help",
      "Unpacking Services",
      "Heavy Lifting",
      "Local Movers",
      "Junk Pickup",
      "Furniture Movers",
      "One Item Movers",
    ],
    [
      "Furniture Assembly",
      "Patio Furniture Assembly",
      "Desk Assembly",
      "Dresser Assembly",
      "Bed Assembly",
      "Bookshelf Assembly",
      "Couch Assembly",
      "Chair Assembly",
      "Wardrobe Assembly",
    ],
    [
      "TV Mounting",
      "Install Shelves, Rods & Hooks",
      "Ceiling Fan Installation",
      "Install Blinds & Window Treatments",
      "Hang Art, Mirror & Decor",
      "General Mounting",
      "Hang Christmas Lights",
    ],
    [
      "House Cleaning Services",
      "Deep Cleaning",
      "Disinfecting Services",
      "Move In Cleaning",
      "Move Out Cleaning",
      "Vacation Rental Cleaning",
      "Carpet Cleaning Service",
      "Garage Cleaning",
      "One Time Cleaning Services",
    ],
    [
      "Delivery Service",
      "Grocery Shopping & Delivery",
      "Running Your Errands",
      "Christmas Tree Delivery",
      "Wait in Line",
      "Deliver Big Piece of Furniture",
      "Drop Off Donations",
      "Contactless Delivery",
      "Pet Food Delivery",
    ],
    [
      "Light Installation",
      "Furniture Removal",
      "Smart Home Installation",
      "Organization",
      "Furniture Assembly",
      "General Mounting",
    ],
    [
      "Gardening Services",
      "Weed Removal",
      "Lawn Care Services",
      "Lawn Mowing Services",
      "Landscaping Services",
      "Gutter Cleaning",
      "Tree Trimming Service",
      "Vacation Plant Watering",
      "Patio Cleaning",
    ],
    [
      "Gift Wrapping Services",
      "Hang Christmas Lights",
      "Christmas Tree Delivery",
      "Holiday Decorating",
      "Party Cleaning",
      "Toy Assembly Service",
      "Wait in Line",
      "Christmas Tree Removal",
    ],
    [
      "Snow Removal",
      "Sidewalk Salting",
      "Window Winterization",
      "Residential Snow Removal",
      "Christmas Tree Removal",
      "AC Winterization",
      "Winter Yardwork",
      "Pipe Insulation",
      "Storm Door Installation",
    ],
    [
      "Personal Assistant",
      "Running Your Errands",
      "Wait in Line",
      "Organization",
      "Organize Home",
      "Closet Organization Service",
      "Interior Design Service",
      "Virtual Assistant",
      "Dog Walking",
    ],
    [
      "Baby Proofing",
      "Baby Food Delivery",
      "Organize a Room",
      "Painting",
      "Toy Assembly Service",
      "Smart Home Installation",
      "Delivery",
      "Shopping",
      "General Cleaning",
    ],
    ["Virtual Assistant", "Organization", "Data Entry", "Computer Help"],
    [
      "Office Cleaning",
      "Office Tech Setup",
      "Office Movers",
      "Office Supply & Snack Delivery",
      "Office Furniture Assembly",
      "Office Setup & Organization",
      "Office Administration",
      "Office Interior Design",
      "Moving Office Furniture",
    ],
    [
      "Contactless Delivery",
      "Contactless Prescription Pick-up & Delivery",
      "Running Your Errands",
      "Grocery Shopping & Delivery",
      "Disinfecting Services",
      "Drop Off Donations",
      "Yard Work Services",
      "Virtual Assistant",
    ],
  ];
  const categoryElement = (
    <div className="flex flex-wrap justify-center">
      {Category.map((category, categoryIndex) => (
        <div
          key={categoryIndex}
          className="card bg-white shadow-md rounded-lg p-6 m-4 w-80"
        >
          <h3>
            <b>{category}</b>
          </h3>
          <ul>
            {SubCat[categoryIndex].map((subCategory, index) => (
              <li key={index}>{subCategory}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center justify-center">{categoryElement}</div>
  );
}
