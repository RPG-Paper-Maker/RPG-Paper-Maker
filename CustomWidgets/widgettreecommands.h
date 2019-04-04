/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETTREECOMMANDS_H
#define WIDGETTREECOMMANDS_H

#include <QTreeView>
#include <QMouseEvent>
#include <QStandardItemModel>
#include "gamedatas.h"
#include "contextmenulist.h"
#include "eventcommand.h"
#include "systemcommonobject.h"

// -------------------------------------------------------
//
//  CLASS WidgetTreeCommands
//
//  A widget representing the tree command lines.
//
// -------------------------------------------------------

class WidgetTreeCommands : public QTreeView
{
    Q_OBJECT

public:
    explicit WidgetTreeCommands(QWidget *parent = 0);
    ~WidgetTreeCommands();
    void initializeModel(QStandardItemModel* m);
    void initializeLinkedObject(SystemCommonObject* object);
    void initializeParameters(QStandardItemModel* parameters);
    QStandardItem* getSelected() const;
    QStandardItemModel* getModel() const;
    QList<QStandardItem*> getAllSelected() const;

private:
    QStandardItemModel* p_model;
    GameDatas* p_gameDatas;
    ContextMenuList* m_contextMenuCommonCommands;
    QList<QStandardItem*> m_copiedCommands;
    SystemCommonObject* m_linkedObject;
    QStandardItemModel* m_parameters;

protected:
    QStandardItem* getRootOfCommand(QStandardItem* selected) const;
    void newCommand(QStandardItem *selected);
    void editCommand(QStandardItem *selected, EventCommand *command);
    void copyCommand();
    void pasteCommand(QStandardItem *selected);
    void openCommand();
    QStandardItem* insertCommand(EventCommand* command, QStandardItem* root,
                                 int pos);
    void insertWhileBlock(QStandardItem *root, int pos);
    void insertIfBlock(EventCommand* command, QStandardItem *root, int pos);
    void insertElseBlock(QStandardItem *root, int pos);
    void insertStartBattle(QStandardItem *root, int pos);
    void deleteCommand();
    void deleteEndBlock(QStandardItem *root, int row);
    void deleteElseBlock(QStandardItem *root, int row);
    void deleteStartBattleBlock(QStandardItem *root, int row);
    void updateAllNodesString(QStandardItem* item);
    void selectChildren(QStandardItem* item);
    void selectChildrenOnly(QStandardItem* item);
    static bool itemLessThan(const QStandardItem* item1,
                             const QStandardItem* item2);
    /// Return the index of the row above current selection.
    /// If there is no selection, return the index of the last row.
    static int getInsertionRow(const QStandardItem* selected, const QStandardItem* root);

    virtual void keyPressEvent(QKeyEvent *event);
    virtual void mouseDoubleClickEvent(QMouseEvent* event);

private slots:
    void onSelectionChanged(QModelIndex index, QModelIndex);
    void onTreeViewClicked(const QModelIndex &);
    void showContextMenu(const QPoint & p);
    void contextNew();
    void contextEdit();
    void contextCopy();
    void contextPaste();
    void contextDelete();
};

#endif // WIDGETTREECOMMANDS_H
