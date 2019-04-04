/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef CONTEXTMENUCOMMANDLIST_H
#define CONTEXTMENUCOMMANDLIST_H

#include <QMenu>

// -------------------------------------------------------
//
//  CLASS ContextMenuCommandList
//
//  This is the pop-up generaly used. There can be different
//  kind of pop-up (for commands list, tree map, super lists...)
//
// -------------------------------------------------------

class ContextMenuList : public QMenu
{
    Q_OBJECT
public:
    explicit ContextMenuList(QWidget *parent = nullptr);

    static ContextMenuList * createContextCommand(QWidget *parent = nullptr);
    static ContextMenuList * createContextSuperList(QWidget *parent = nullptr);
    static ContextMenuList * createContextMap(QWidget *parent = nullptr);
    static ContextMenuList * createContextDirectory(QWidget *parent = nullptr);
    static ContextMenuList * createContextObject(QWidget *parent = nullptr);
    static ContextMenuList * createContextPraticable(QWidget *parent = nullptr);

    void setActionNew(QAction *action);
    void setActionEdit(QAction *action);
    void setActionCopy(QAction *action);
    void setActionPaste(QAction *action);
    void setActionDelete(QAction *action);
    void setActionHero(QAction *action);
    void canNew(bool b);
    void canEdit(bool b);
    void canCopy(bool b);
    void canPaste(bool b);
    void canDelete(bool b);
    void canHero(bool b);

protected:
    QAction *m_actionNew;
    QAction *m_actionEdit;
    QAction *m_actionCopy;
    QAction *m_actionPaste;
    QAction *m_actionDelete;
    QAction *m_actionHero;

public slots:
    void showContextMenu(const QPoint &p);
};

#endif // CONTEXTMENUCOMMANDLIST_H
