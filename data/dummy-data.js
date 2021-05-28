import Product from '../models/product';

const PRODUCTS = [
    new Product(
        'p1',
        'u1',
        'Original',
        'https://raw.githubusercontent.com/ZubairovSalim/balance-board-react/master/frontend/public/images/d1.png',
        'Standard balance bord without print.',
        1700
    ),
    new Product(
        'p2',
        'u1',
        'Original (Chinese Dragon)',
        'https://raw.githubusercontent.com/ZubairovSalim/balance-board-react/master/frontend/public/images/d2.png',
        'Standard balance bord with chinese dragon print.',
        2400
    ),
    new Product(
        'p3',
        'u2',
        'Original (With Mountains)',
        'https://raw.githubusercontent.com/ZubairovSalim/balance-board-react/master/frontend/public/images/d3.png',
        'Standard balance bord with mountains print.',
        2400
    ),
    new Product(
        'p4',
        'u3',
        'Original (Tortoise in Lines)',
        'https://raw.githubusercontent.com/ZubairovSalim/balance-board-react/master/frontend/public/images/d4.png',
        'Standard balance bord with tortoise in lines print.',
        2400
    ),
    new Product(
        'p5',
        'u3',
        'Original (Lady in Flowers)',
        'https://raw.githubusercontent.com/ZubairovSalim/balance-board-react/master/frontend/public/images/d5.png',
        'Standard balance bord with lady in flowers print.',
        2400
    )
];

export default PRODUCTS;
