/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETSUPERTREE_H
#define WIDGETSUPERTREE_H

#include <QTreeView>
#include <QStandardItemModel>
#include "contextmenulist.h"
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS WidgetSuperTree
//
//  Represents the custom list widget used for displaying
//  any list of super items. The difference with the super
//  list is that you always have an empty line at the end
//  (making it possible to add/remove any item directly).
//
// -------------------------------------------------------

class WidgetSuperTree : public QTreeView
{
    Q_OBJECT
public:
    explicit WidgetSuperTree(QWidget *parent = 0);
    virtual ~WidgetSuperTree();
    QStandardItemModel* getModel() const;
    void setUpdateId(bool b);
    void initializeModel(QStandardItemModel* m);
    void initializeNewItemInstance(SuperListItem *item);
    void setHasContextMenu(bool b);
    void setCanBeEmpty(bool b);
    void setCanBeControled(bool b);
    void setCanMove(bool b);

    static int getNewId(QStandardItemModel* model, int offset = 1);
    QStandardItem* getSelected() const;
    void addNewItem(SuperListItem* super, QStandardItem* root, int index);
    void updateAllModelRow();

    static void copy(QStandardItemModel *model,
                     QStandardItemModel *modelToCopy);
    static void read(QStandardItemModel *model, SuperListItem &newInstance,
                     const QJsonArray &json);
    static void write(QStandardItemModel *model, QJsonArray &json);

protected:
    void keyPressEvent(QKeyEvent *event);
    void mouseDoubleClickEvent(QMouseEvent * event);

private:
    QStandardItemModel* p_model;
    ContextMenuList* m_contextMenuCommonCommands;
    SuperListItem* m_newItemInstance;
    SuperListItem* m_copiedItem;
    bool m_canBeEmpty;
    bool m_updateId;
    bool m_hasContextMenu;
    bool m_canBeControled;
    bool m_canMove;

    QStandardItem* getRootOfItem(QStandardItem* selected);
    void setItem(QStandardItem *selected, SuperListItem* super);

    virtual void newItem(QStandardItem *selected);
    virtual void editItem(QStandardItem *selected);
    virtual void copyItem(QStandardItem *selected);
    virtual void pasteItem(QStandardItem *selected);
    virtual void deleteItem(QStandardItem *selected);
    virtual void updateAllNodesString(QStandardItem* item);

private slots:
    void onSelectionChanged(QModelIndex index, QModelIndex);
    void showContextMenu(const QPoint & p);
    void contextNew();
    void contextEdit();
    void contextCopy();
    void contextPaste();
    void contextDelete();

signals:
    void needsUpdateJson(SuperListItem* super);
    void deletingItem(SuperListItem* super, int row);
    void tryingEdit();
};

#endif // WIDGETSUPERTREE_H
