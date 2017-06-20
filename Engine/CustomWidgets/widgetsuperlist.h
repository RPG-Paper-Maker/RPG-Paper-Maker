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

    void brutDelete(QStandardItem* item);

private slots:
    void openDialog(QModelIndex);
    void showContextMenu(const QPoint & p);
    void contextCopy();
    void contextPaste();
    void contextDelete();
};

#endif // WIDGETSUPERLIST_H
