/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    explicit WidgetSuperList(QWidget *parent = nullptr);
    virtual ~WidgetSuperList();
    void setCanBrutRemove(bool b);
    void setHasContextMenu(bool b);
    void setCanEdit(bool b);
    void setAreNegIDsEnabled(bool b);
    void setCanDragAndDrop(bool b);
    void setCanCopyPaste(bool b);
    void initializeModel(QStandardItemModel* m);
    void initializeNewItemInstance(SuperListItem *item);
    QStandardItemModel* getModel() const;
    QStandardItem* getSelected() const;
    void setName(const QString& s);
    void setIndex(int i);
    int getIndex();
    void setMaximum(int newSize);
    void addNewItem(SuperListItem* super);
    void updateKeyboardUpDown(int offset);

protected:
    void keyPressEvent(QKeyEvent *event);

private:
    QStandardItemModel* p_model;
    SuperListItem* m_newItemInstance; 
    ContextMenuList* m_contextMenu;
    SuperListItem *m_copiedItem;
    bool m_canBrutRemove;
    bool m_hasContextMenu;
    bool m_canEdit;
    bool m_areNegIDsEnabled;
    bool m_canCopyPaste;

    void copy(QStandardItem *selected);
    void paste(QStandardItem *selected);
    void brutDelete(QStandardItem *selected);
    void deleteClear(QStandardItem *selected);
    void translate();

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
