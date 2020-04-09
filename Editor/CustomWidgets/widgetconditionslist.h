/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETCONDITIONSLIST_H
#define WIDGETCONDITIONSLIST_H

#include <QListView>
#include <QStandardItemModel>
#include <QMouseEvent>

// -------------------------------------------------------
//
//  CLASS WidgetConditionsList
//
//  A listView used for displaying conditions (generaly associated
//  to a set of commands).
//
// -------------------------------------------------------

class WidgetConditionsList : public QListView
{
    Q_OBJECT
public:
    explicit WidgetConditionsList(QWidget *parent = nullptr);
    void initializeModel(QStandardItemModel *m);

protected:
    virtual void mouseDoubleClickEvent(QMouseEvent *event);
    void updateAllNodesString();

private:
    QStandardItemModel *m_model;
};

#endif // WIDGETCONDITIONSLIST_H
