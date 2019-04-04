/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
