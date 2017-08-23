import { Menu, MenuItem } from 'electron';


export const applicationMenu = new Menu();

applicationMenu.append(new MenuItem({
    label: 'App',
    submenu: [
        { role: 'quit' }
    ]
}));

applicationMenu.append(new MenuItem({
    label: 'Edit',
    submenu: [
        { role: 'undo' }
    ]
}));
