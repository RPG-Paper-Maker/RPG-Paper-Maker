/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "contextmenulist.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ContextMenuList::ContextMenuList(QWidget *parent) :
    QMenu(parent)
{

}


void ContextMenuList::setActionNew(QAction *action) {
    m_actionNew = action;
}

void ContextMenuList::setActionEdit(QAction *action) {
    m_actionEdit = action;
}

void ContextMenuList::setActionCopy(QAction *action) {
    m_actionCopy = action;
}

void ContextMenuList::setActionPaste(QAction *action) {
    m_actionPaste = action;
}

void ContextMenuList::setActionDelete(QAction *action) {
    m_actionDelete = action;
}

void ContextMenuList::setActionHero(QAction *action) {
    m_actionHero = action;
}

void ContextMenuList::canNew(bool b) {
    m_actionNew->setEnabled(b);
}

void ContextMenuList::canEdit(bool b) {
    m_actionEdit->setEnabled(b);
}

void ContextMenuList::canCopy(bool b) {
    m_actionCopy->setEnabled(b);
}

void ContextMenuList::canPaste(bool b) {
    m_actionPaste->setEnabled(b);
}

void ContextMenuList::canDelete(bool b) {
    m_actionDelete->setEnabled(b);
}

void ContextMenuList::canHero(bool b) {
    m_actionHero->setEnabled(b);
}


// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

ContextMenuList * ContextMenuList::createContextCommand(QWidget *parent) {
    ContextMenuList *menu = new ContextMenuList(parent);

    // Creating actions
    QAction *actionNew = new QAction(RPM::translate(Translations::NEW), parent);
    QAction *actionEdit = new QAction(RPM::translate(Translations::EDIT), parent);
    QAction *actionCopy = new QAction(RPM::translate(Translations::COPY), parent);
    QAction *actionPaste = new QAction(RPM::translate(Translations::PASTE),
        parent);
    QAction *actionDelete = new QAction(RPM::translate(Translations::DELETE_MESSAGE),
        parent);
    menu->setActionNew(actionNew);
    menu->setActionEdit(actionEdit);
    menu->setActionCopy(actionCopy);
    menu->setActionPaste(actionPaste);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionNew->setShortcut(QKeySequence(Qt::Key_Enter));
    actionEdit->setShortcut(QKeySequence(Qt::Key_Enter));
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

ContextMenuList * ContextMenuList::createContextSuperList(QWidget *parent) {
    ContextMenuList *menu = new ContextMenuList(parent);

    // Creating actions
    QAction *actionEdit = new QAction(RPM::translate(Translations::EDIT), parent);
    QAction *actionCopy = new QAction(RPM::translate(Translations::COPY), parent);
    QAction *actionPaste = new QAction(RPM::translate(Translations::PASTE), parent);
    QAction *actionDelete = new QAction(RPM::translate(Translations::DELETE_MESSAGE), parent);
    menu->setActionEdit(actionEdit);
    menu->setActionCopy(actionCopy);
    menu->setActionPaste(actionPaste);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionEdit->setShortcut(QKeySequence(Qt::Key_Enter));
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
    connect(actionEdit, SIGNAL(triggered()), parent, SLOT(contextEdit()));
    connect(actionCopy, SIGNAL(triggered()), parent, SLOT(contextCopy()));
    connect(actionPaste, SIGNAL(triggered()), parent, SLOT(contextPaste()));
    connect(actionDelete, SIGNAL(triggered()), parent, SLOT(contextDelete()));

    return menu;
}

// -------------------------------------------------------

ContextMenuList * ContextMenuList::createContextMap(QWidget *parent) {
    ContextMenuList *menu = new ContextMenuList(parent);

    // Creating actions
    QAction *actionEdit = new QAction(RPM::translate(Translations
        ::EDIT_MAP_PROPERTIES), parent);
    QAction *actionCopy = new QAction(RPM::translate(Translations::COPY), parent);
    QAction *actionDelete = new QAction(RPM::translate(Translations::DELETE_MESSAGE),
        parent);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionEdit->setShortcut(QKeySequence(Qt::Key_Enter));
    actionCopy->setShortcut(QKeySequence(QKeySequence::Copy));
    actionDelete->setShortcut(QKeySequence(QKeySequence::Delete));

    // Adding action to the menu
    menu->addAction(actionEdit);
    menu->addSeparator();
    menu->addAction(actionCopy);
    menu->addSeparator();
    menu->addAction(actionDelete);

    // Connexions
    connect(actionEdit, SIGNAL(triggered()), parent, SLOT(contextEditMap()));
    connect(actionCopy, SIGNAL(triggered()), parent, SLOT(contextCopyMap()));
    connect(actionDelete, SIGNAL(triggered()), parent, SLOT(contextDeleteMap()));

    return menu;
}

// -------------------------------------------------------

ContextMenuList * ContextMenuList::createContextDirectory(QWidget *parent) {
    ContextMenuList *menu = new ContextMenuList(parent);

    // Creating actions
    QAction *actionNewMap = new QAction(RPM::translate(Translations::NEW_MAP),
        parent);
    QAction *actionNewDirectory = new QAction(RPM::translate(Translations
        ::NEW_DIRECTORY), parent);
    QAction *actionEdit = new QAction(RPM::translate(Translations::EDIT_NAME),
        parent);
    QAction *actionCopy = new QAction(RPM::translate(Translations::COPY), parent);
    QAction *actionPaste = new QAction(RPM::translate(Translations::PASTE),
        parent);
    QAction *actionDelete = new QAction(RPM::translate(Translations::DELETE_MESSAGE),
        parent);
    menu->setActionPaste(actionPaste);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionNewMap->setShortcut(QKeySequence(Qt::CTRL + Qt::Key_M));
    actionNewDirectory->setShortcut(QKeySequence(Qt::CTRL + Qt::Key_D));
    actionEdit->setShortcut(QKeySequence(Qt::Key_Enter));
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
    connect(actionNewMap, SIGNAL(triggered()), parent, SLOT(contextNewMap()));
    connect(actionNewDirectory, SIGNAL(triggered()), parent, SLOT(contextNewDirectory()));
    connect(actionEdit, SIGNAL(triggered()), parent, SLOT(contextEditDirectory()));
    connect(actionCopy, SIGNAL(triggered()), parent, SLOT(contextCopyDirectory()));
    connect(actionPaste, SIGNAL(triggered()), parent, SLOT(contextPaste()));
    connect(actionDelete, SIGNAL(triggered()), parent, SLOT(contextDeleteDirectory()));

    return menu;
}

// -------------------------------------------------------

ContextMenuList * ContextMenuList::createContextObject(QWidget *parent) {
    ContextMenuList *menu = new ContextMenuList(parent);

    // Creating actions
    QAction *actionNew = new QAction(RPM::translate(Translations::NEW), parent);
    QAction *actionEdit = new QAction(RPM::translate(Translations::EDIT), parent);
    QAction *actionCopy = new QAction(RPM::translate(Translations::COPY), parent);
    QAction *actionPaste = new QAction(RPM::translate(Translations::PASTE),
        parent);
    QAction *actionDelete = new QAction(RPM::translate(Translations::DELETE_MESSAGE),
        parent);
    QAction *actionHero = new QAction(RPM::translate(Translations
        ::DEFINE_AS_THE_HERO), parent);
    menu->setActionNew(actionNew);
    menu->setActionEdit(actionEdit);
    menu->setActionCopy(actionCopy);
    menu->setActionPaste(actionPaste);
    menu->setActionDelete(actionDelete);
    menu->setActionHero(actionHero);

    // Editing shortcut
    actionNew->setShortcut(QKeySequence(Qt::Key_Enter));
    actionEdit->setShortcut(QKeySequence(Qt::Key_Enter));
    actionCopy->setShortcut(QKeySequence(QKeySequence::Copy));
    actionPaste->setShortcut(QKeySequence(QKeySequence::Paste));
    actionDelete->setShortcut(QKeySequence(QKeySequence::Delete));
    actionHero->setShortcut(QKeySequence(Qt::Key_H));

    // Adding action to the menu
    menu->addAction(actionNew);
    menu->addAction(actionEdit);
    menu->addSeparator();
    menu->addAction(actionCopy);
    menu->addAction(actionPaste);
    menu->addSeparator();
    menu->addAction(actionDelete);
    menu->addSeparator();
    menu->addAction(actionHero);

    // Connexions
    connect(actionNew, SIGNAL(triggered()), parent, SLOT(contextNew()));
    connect(actionEdit, SIGNAL(triggered()), parent, SLOT(contextEdit()));
    connect(actionCopy, SIGNAL(triggered()), parent, SLOT(contextCopy()));
    connect(actionPaste, SIGNAL(triggered()), parent, SLOT(contextPaste()));
    connect(actionDelete, SIGNAL(triggered()), parent, SLOT(contextDelete()));
    connect(actionHero, SIGNAL(triggered()), parent, SLOT(contextHero()));

    return menu;
}

// -------------------------------------------------------

ContextMenuList * ContextMenuList::createContextPraticable(QWidget *parent) {
    ContextMenuList *menu;
    QAction *actionEdit, *actionDelete;

    menu = new ContextMenuList(parent);

    // Creating actions
    actionEdit = new QAction(RPM::translate(Translations::EDIT), parent);
    actionDelete = new QAction(RPM::translate(Translations::DELETE_MESSAGE), parent);
    menu->setActionEdit(actionEdit);
    menu->setActionDelete(actionDelete);

    // Editing shortcut
    actionEdit->setShortcut(QKeySequence(Qt::Key_Enter));
    actionDelete->setShortcut(QKeySequence(QKeySequence::Delete));

    // Adding action to the menu
    menu->addAction(actionEdit);
    menu->addSeparator();
    menu->addAction(actionDelete);

    // Connexions
    connect(actionEdit, SIGNAL(triggered()), parent, SLOT(contextEdit()));
    connect(actionDelete, SIGNAL(triggered()), parent, SLOT(contextDelete()));

    return menu;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void ContextMenuList::showContextMenu(const QPoint &p) {
    this->exec(this->parentWidget()->mapToGlobal(p));
}
