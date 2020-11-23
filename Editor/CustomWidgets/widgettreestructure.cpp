/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettreestructure.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTreeStructure::WidgetTreeStructure(QWidget *parent) :
    WidgetSuperTree(parent)
{
    this->setMouseTracking(true);
    this->setWordWrap(true);
    this->setHeaderHidden(true);
    this->setIndentation(15);
}

WidgetTreeStructure::~WidgetTreeStructure()
{
    this->removeStructureModel();
}

// -------------------------------------------------------
//
//  STATIC FUNCTIONS
//
// -------------------------------------------------------

bool WidgetTreeStructure::itemLessThan(const QStandardItem *item1, const
    QStandardItem *item2)
{
    return item1->row() < item2->row();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItem * WidgetTreeStructure::first() const
{
    return p_model->item(0);
}

// -------------------------------------------------------

QStandardItem * WidgetTreeStructure::last() const
{
    return  p_model->item(p_model->invisibleRootItem()->rowCount() - 1);
}

// -------------------------------------------------------

QList<QStandardItem*> WidgetTreeStructure::getAllSelected() const
{
    QList<QStandardItem *> list;
    QStandardItem *item;
    SystemCustomStructureElement *element;
    QItemSelectionModel *selection = this->selectionModel();
    if (selection == nullptr)
    {
        return QList<QStandardItem *>();
    }
    QModelIndexList indexes = selection->selectedRows();
    if (!indexes.isEmpty())
    {
        item = p_model->itemFromIndex(indexes.at(0));
        element = reinterpret_cast<SystemCustomStructureElement *>(item->data()
            .value<quintptr>());
        if (element == nullptr)
        {
            list.append(item);
        } else
        {
            QStandardItem *root = this->getRootOfStructure(item);
            list.append(item);
            for (int i = 1; i < indexes.size(); i++)
            {
                item = p_model->itemFromIndex(indexes.at(i));
                if (getRootOfStructure(item) == root)
                {
                    element = reinterpret_cast<SystemCustomStructureElement *>(
                        item->data().value<quintptr>());
                    if (element != nullptr)
                    {
                        list.append(item);
                    }
                }
            }
        }
        // Sorting in order to be sure to have structure in right order
        std::sort(list.begin(), list.end(), WidgetTreeStructure::itemLessThan);
    }
    return list;
}

// -------------------------------------------------------

QStandardItem * WidgetTreeStructure::getRootOfStructure(QStandardItem *selected)
    const
{
    if (selected != nullptr && selected->parent() != nullptr)
    {
        return selected->parent();
    } else
    {
        return p_model->invisibleRootItem();
    }
}

// -------------------------------------------------------

void WidgetTreeStructure::initializeNodes(PrimitiveValue *v)
{
    m_prim = v;
    this->removeStructureModel();
    QStandardItemModel *model = new QStandardItemModel;

    switch (m_prim->kind())
    {
    case PrimitiveValueKind::CustomStructure:
    {
        this->initializeNodesElement(model->invisibleRootItem(), m_prim);
        break;
    }
    default:
        return;
    }

    /*
    QStandardItem *item = new QStandardItem("{");
    model->appendRow(item);
    QStandardItem *item2 = new QStandardItem("\"k\":");
    item->appendRow(item2);
    QStandardItem *item3 = new QStandardItem("[");
    item2->appendRow(item3);
    QStandardItem *sitem = new QStandardItem("3");
    sitem->setData(QVariant::fromValue(reinterpret_cast<quintptr>(new SystemCustomStructureElement)));
    item3->appendRow(sitem);
    item3->appendRow(new QStandardItem(">"));
    item2->appendRow(new QStandardItem("]"));
    item->appendRow(new QStandardItem(">"));
    model->appendRow(new QStandardItem("}"));
    */
    this->initializeModel(model);
    this->expandAll();
}

// -------------------------------------------------------

void WidgetTreeStructure::initializeNodesCustom(QStandardItem *parent,
    SystemCustomStructure *custom)
{
    SystemCustomStructureElement *element;
    for (int i = 0, l = custom->model()->invisibleRootItem()->rowCount(); i < l;
        i++)
    {
        element = reinterpret_cast<SystemCustomStructureElement *>(SuperListItem
            ::getItemModelAt(custom->model(), i));
        this->initializeNodesElement(parent, element->value(), element);
    }
    parent->appendRow(new QStandardItem(">"));
}

// -------------------------------------------------------

void WidgetTreeStructure::initializeNodesElement(QStandardItem *parent,
    PrimitiveValue *value, SystemCustomStructureElement *element)
{
    QStandardItem *item;
    switch (value->kind())
    {
    case PrimitiveValueKind::CustomStructure:
        item = new QStandardItem("{");
        parent->appendRow(item);
        parent->appendRow(new QStandardItem("}"));
        this->initializeNodesCustom(item, value->customStructure());
        break;
    case PrimitiveValueKind::CustomList:
        item = new QStandardItem("[");
        parent->appendRow(item);
        parent->appendRow(new QStandardItem("]"));
        this->initializeNodesCustom(item, value->customList());
        break;
    default:
        if (element != nullptr)
        {
            parent->appendRow(element->getModelRow());
        }
        break;
    }
}

// -------------------------------------------------------

void WidgetTreeStructure::removeStructureModel()
{
    QStandardItemModel *model = this->getModel();
    if (model != nullptr)
    {
        delete model;
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QStandardItem* WidgetTreeStructure::getSelected() const
{
    QList<QStandardItem *> list = getAllSelected();
    return list.isEmpty() ? nullptr : list.first();
}

// -------------------------------------------------------

void WidgetTreeStructure::newItem(QStandardItem *selected)
{
    // If first node, impossible to edit
    if (selected == this->first() || selected == this->last())
    {
        return;
    }
    bool isProperty = true;
    if (selected->parent() == this->first())
    {
        isProperty = m_prim->kind() == PrimitiveValueKind::CustomStructure;
    }
    SuperListItem *super = new SystemCustomStructureElement(0, "", isProperty);
    emit beforeOpeningWindow();
    if (super->openDialog()){
        QStandardItem *root = this->getRootOfItem(selected);
        int index = selected->row();
        this->addNewItem(super, root, index);
    } else
    {
        delete super;
    }
    emit windowClosed();
}
