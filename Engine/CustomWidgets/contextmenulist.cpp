/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "contextmenulist.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ContextMenuList::ContextMenuList(QWidget *parent) : QMenu(parent)
{

}

// -------------------------------------------------------

ContextMenuList* ContextMenuList::createContextCommand(QWidget *parent){
    ContextMenuList* menu = new ContextMenuList(parent);

    // Creating actions
    QAction* actionNew = new QAction("New", parent);
    QAction* actionEdit = new QAction("Edit", parent);
    QAction* actionCopy = new QAction("Copy", parent);
    QAction* actionPaste = new QAction("Paste", parent);
    QAction* actionDelete = new QAction("Delete", parent);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionNew->setShortcut(QKeySequence(QKeySequence::New));
    actionEdit->setShortcut(QKeySequence(QKeySequence::Replace));
    actionCopy->setShortcut(QKeySequence(QKeySequence::Copy));
    actionPaste->setShortcut(QKeySequence(QKeySequence::Paste));
    actionDelete->setShortcut(QKeySequence(QKeySequence::Delete));

    // Adding action to the menu
    menu->addAction(actionNew);
    menu->addAction(actionEdit);
    menu->addSeparator();
    menu->addAction(actionCopy);
    menu->addAction(actionPaste);
    menu->addSeparator();
    menu->addAction(actionDelete);

    // Connexions
    connect(actionNew, SIGNAL(triggered()), parent, SLOT(contextNew()));
    connect(actionEdit, SIGNAL(triggered()), parent, SLOT(contextEdit()));
    connect(actionCopy, SIGNAL(triggered()), parent, SLOT(contextCopy()));
    connect(actionPaste, SIGNAL(triggered()), parent, SLOT(contextPaste()));
    connect(actionDelete, SIGNAL(triggered()), parent, SLOT(contextDelete()));

    return menu;
}

// -------------------------------------------------------

ContextMenuList* ContextMenuList::createContextSuperList(QWidget *parent){
    ContextMenuList* menu = new ContextMenuList(parent);

    // Creating actions
    QAction* actionCopy = new QAction("Copy", parent);
    QAction* actionPaste = new QAction("Paste", parent);
    QAction* actionDelete = new QAction("Delete", parent);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionCopy->setShortcut(QKeySequence(QKeySequence::Copy));
    actionPaste->setShortcut(QKeySequence(QKeySequence::Paste));
    actionDelete->setShortcut(QKeySequence(QKeySequence::Delete));

    // Adding action to the menu
    menu->addAction(actionCopy);
    menu->addAction(actionPaste);
    menu->addSeparator();
    menu->addAction(actionDelete);

    // Connexions
    connect(actionCopy, SIGNAL(triggered()), parent, SLOT(contextCopy()));
    connect(actionPaste, SIGNAL(triggered()), parent, SLOT(contextPaste()));
    connect(actionDelete, SIGNAL(triggered()), parent, SLOT(contextDelete()));

    return menu;
}

// -------------------------------------------------------

ContextMenuList* ContextMenuList::createContextMap(QWidget *parent){
    ContextMenuList* menu = new ContextMenuList(parent);

    // Creating actions
    QAction* actionEdit = new QAction("Edit map properties", parent);
    QAction* actionCopy = new QAction("Copy map", parent);
    QAction* actionPaste = new QAction("Paste map", parent);
    QAction* actionDelete = new QAction("Delete map", parent);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionEdit->setShortcut(QKeySequence(QKeySequence::Replace));
    actionCopy->setShortcut(QKeySequence(QKeySequence::Copy));
    actionPaste->setShortcut(QKeySequence(QKeySequence::Paste));
    actionDelete->setShortcut(QKeySequence(QKeySequence::Delete));

    // Adding action to the menu
    menu->addAction(actionEdit);
    menu->addSeparator();
    menu->addAction(actionCopy);
    menu->addAction(actionPaste);
    menu->addSeparator();
    menu->addAction(actionDelete);

    // Connexions
    connect(actionEdit, SIGNAL(triggered()), parent, SLOT(contextEditMap()));
    connect(actionCopy, SIGNAL(triggered()), parent, SLOT(contextCopyMap()));
    connect(actionPaste, SIGNAL(triggered()), parent, SLOT(contextPasteMap()));
    connect(actionDelete, SIGNAL(triggered()), parent,
            SLOT(contextDeleteMap()));

    return menu;
}

// -------------------------------------------------------

ContextMenuList* ContextMenuList::createContextDirectory(QWidget *parent){
    ContextMenuList* menu = new ContextMenuList(parent);

    // Creating actions
    QAction* actionNewMap = new QAction("New map", parent);
    QAction* actionNewDirectory = new QAction("New directory", parent);
    QAction* actionEdit = new QAction("Edit directory", parent);
    QAction* actionCopy = new QAction("Copy directory", parent);
    QAction* actionPaste = new QAction("Paste directory", parent);
    QAction* actionDelete = new QAction("Delete directory", parent);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionEdit->setShortcut(QKeySequence(QKeySequence::Replace));
    actionCopy->setShortcut(QKeySequence(QKeySequence::Copy));
    actionPaste->setShortcut(QKeySequence(QKeySequence::Paste));
    actionDelete->setShortcut(QKeySequence(QKeySequence::Delete));

    // Adding action to the menu
    menu->addAction(actionNewMap);
    menu->addAction(actionNewDirectory);
    menu->addAction(actionEdit);
    menu->addSeparator();
    menu->addAction(actionCopy);
    menu->addAction(actionPaste);
    menu->addSeparator();
    menu->addAction(actionDelete);

    // Connexions
    connect(actionNewMap, SIGNAL(triggered()), parent,
            SLOT(contextNewMap()));
    connect(actionNewDirectory, SIGNAL(triggered()), parent,
            SLOT(contextNewDirectory()));
    connect(actionEdit, SIGNAL(triggered()), parent,
            SLOT(contextEditDirectory()));
    connect(actionCopy, SIGNAL(triggered()), parent,
            SLOT(contextCopyDirectory()));
    connect(actionPaste, SIGNAL(triggered()), parent,
            SLOT(contextPasteDirectory()));
    connect(actionDelete, SIGNAL(triggered()), parent,
            SLOT(contextDeleteDirectory()));

    return menu;
}

// -------------------------------------------------------

void ContextMenuList::setActionDelete(QAction* action){
    m_actionDelete = action;
}

// -------------------------------------------------------

void ContextMenuList::canDelete(bool b){
    m_actionDelete->setEnabled(b);
}

// -------------------------------------------------------

void ContextMenuList::showContextMenu(const QPoint &p)
{
    this->exec(this->parentWidget()->mapToGlobal(p));
}
