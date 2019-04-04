/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETSUPERLIST_H
#define WIDGETSUPERLIST_H

#include <QWidget>
#include <QListView>
#include <QStandardItemModel>
#include "superlistitem.h"
#include "contextmenulist.h"

// -------------------------------------------------------
//
//  CLASS WidgetSuperList
//
//  Represents the custom list widget used in PanelSuperList class.
//
// -------------------------------------------------------

class WidgetSuperList : public QListView
{
    Q_OBJECT
public:
    explicit WidgetSuperList(QWidget *parent = 0);
    virtual ~WidgetSuperList();
    void setCanBrutRemove(bool b);
    void setHasContextMenu(bool b);
    void setCanEdit(bool b);
    void setCanDragAndDrop(bool b);
    void initializeModel(QStandardItemModel* m);
    void initializeNewItemInstance(SuperListItem *item);
    QStandardItemModel* getModel() const;
    QStandardItem* getSelected() const;
    void setName(const QString& s);
    void setIndex(int i);
    int getIndex();
    void setMaximum(int newSize);
    void addNewItem(SuperListItem* super);

protected:
    void keyPressEvent(QKeyEvent *event);

private:
    QStandardItemModel* p_model;
    SuperListItem* m_newItemInstance; 
    ContextMenuList* m_contextMenu;
    bool m_canBrutRemove;
    bool m_hasContextMenu;
    bool m_canEdit;

    void brutDelete(QStandardItem* item);

private slots:
    void openDialog(QModelIndex);
    void showContextMenu(const QPoint & p);
    void contextEdit();
    void contextCopy();
    void contextPaste();
    void contextDelete();

signals:
    void updated();
    void deleteIDs();
    void tryingEdit();
};

#endif // WIDGETSUPERLIST_H
