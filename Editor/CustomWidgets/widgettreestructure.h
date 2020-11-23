/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETTREESTRUCTURE_H
#define WIDGETTREESTRUCTURE_H

#include "widgetsupertree.h"
#include "primitivevalue.h"
#include "systemcustomstructureelement.h"

// -------------------------------------------------------
//
//  CLASS WidgetTreeStructure
//
//  A widget representing the custom structure or list.
//
// -------------------------------------------------------

class WidgetTreeStructure : public WidgetSuperTree
{
    Q_OBJECT
public:
    WidgetTreeStructure();
    explicit WidgetTreeStructure(QWidget *parent = nullptr);
    ~WidgetTreeStructure();

    static bool itemLessThan(const QStandardItem *item1, const QStandardItem
        *item2);

    QStandardItem * first() const;
    QStandardItem * last() const;
    QList<QStandardItem *> getAllSelected() const;
    QStandardItem * getRootOfStructure(QStandardItem *selected) const;
    void initializeNodes(PrimitiveValue *v);
    void removeStructureModel();
    void initializeNodesCustom(QStandardItem *parent, SystemCustomStructure
        *custom);
    void initializeNodesElement(QStandardItem *parent,
        SystemCustomStructureElement *element = nullptr);
    void selectChildren(QStandardItem *item, QItemSelectionModel::SelectionFlag
        flag = QItemSelectionModel::Select);
    void selectChildrenOnly(QStandardItem *item, QItemSelectionModel
        ::SelectionFlag flag = QItemSelectionModel::Select);

    virtual QStandardItem * getSelected() const;

protected:
    PrimitiveValue *m_prim;
    SystemCustomStructureElement *m_element;

    virtual void newItem(QStandardItem *selected);
    virtual void mousePressEvent(QMouseEvent *event);

public slots:
    void onSelectionChanged(QModelIndex index, QModelIndex indexBefore);
};

#endif // WIDGETTREESTRUCTURE_H
