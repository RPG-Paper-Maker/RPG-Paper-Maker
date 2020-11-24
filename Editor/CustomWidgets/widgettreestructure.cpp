/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QApplication>
#include "widgettreestructure.h"
#include "htmldelegate.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTreeStructure::WidgetTreeStructure(QWidget *parent) :
    WidgetSuperTree(parent),
    m_element(new SystemCustomStructureElement(-1, "", true, nullptr)),
    m_completeList(RPM::get()->selectedList())
{
    this->setMouseTracking(true);
    this->setWordWrap(true);
    this->setHeaderHidden(true);
    this->setIndentation(25);
    this->setDragDropMode(QAbstractItemView::NoDragDrop);
    HTMLDelegate* delegate = new HTMLDelegate();
    this->setItemDelegate(delegate);
}

WidgetTreeStructure::~WidgetTreeStructure()
{
    this->removeStructureModel();
    m_element->setValue(nullptr);
    delete m_element;
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

QStandardItemModel * WidgetTreeStructure::getParentModel(QStandardItem *selected
    , SystemCustomStructureElement *element) const
{
    if (element == nullptr)
    {
        element = reinterpret_cast<SystemCustomStructureElement *>(selected
            ->data().value<quintptr>());
    }
    SystemCustomStructureElement *parentElement = reinterpret_cast<
        SystemCustomStructureElement *>(selected->parent()->data().value<
        quintptr>());
    return (element->isProperty() ? parentElement->value()->customStructure() :
        parentElement->value()->customList())->model();
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
    m_element->setValue(m_prim);
    this->initializeNodesElement(model->invisibleRootItem(), m_element);
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
        if (element != nullptr)
        {
            this->initializeNodesElement(parent, element);
        }
    }
    parent->appendRow(new QStandardItem(">"));
}

// -------------------------------------------------------

void WidgetTreeStructure::initializeNodesElement(QStandardItem *parent,
    SystemCustomStructureElement *element)
{
    QStandardItem *item;
    QList<QStandardItem *> row;
    switch (element->value()->kind())
    {
    case PrimitiveValueKind::CustomStructure:
        row = element->getModelRow();
        item = row.at(0);
        parent->appendRow(item);
        this->initializeNodesCustom(item, element->value()->customStructure());
        row = element->getModelRow();
        item = row.at(0);
        item->setText(element->getStringEnd());
        parent->appendRow(item);
        break;
    case PrimitiveValueKind::CustomList:
        row = element->getModelRow();
        item = row.at(0);
        parent->appendRow(item);
        this->initializeNodesCustom(item, element->value()->customList());
        row = element->getModelRow();
        item = row.at(0);
        item->setText(element->getStringEnd());
        parent->appendRow(item);
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

void WidgetTreeStructure::selectChildren(QStandardItem *item,
    QItemSelectionModel::SelectionFlag flag)
{
    // Select children
    selectChildrenOnly(item, flag);

    // Select structure and lists
    SystemCustomStructureElement *element = reinterpret_cast<
        SystemCustomStructureElement *>(item->data().value<quintptr>());
    QStandardItem *root = this->getRootOfStructure(item);
    QItemSelectionModel *sm = this->selectionModel();
    QStandardItem *st;
    int j = item->row();
    if (element != nullptr && (element->value()->kind() == PrimitiveValueKind
        ::CustomStructure || element->value()->kind() == PrimitiveValueKind
        ::CustomList))
    {
        st = root->child(j + ((item->text() == element->getStringEnd()) ? -1 : 1));
        sm->select(st->index(), flag);
        selectChildrenOnly(st, flag);
    }
}

// -------------------------------------------------------

void WidgetTreeStructure::selectChildrenOnly(QStandardItem *item,
    QItemSelectionModel::SelectionFlag flag)
{
    QModelIndex index = item->index();
    QModelIndex childIndex;
    for (int i = 0; i < item->rowCount(); i++)
    {
        childIndex = p_model->index(i, 0, index);
        this->selectionModel()->select(childIndex, flag);
        this->selectChildren(item->child(i));
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

void WidgetTreeStructure::updateKeyboardUpDown(int offset)
{
    QStandardItem *itemBegin = this->getSelected();
    QStandardItem *item = itemBegin;
    if (item != nullptr)
    {
        SystemCustomStructureElement *element = nullptr;
        QStandardItem *newItem = item->parent();
        if (newItem == nullptr)
        {
            newItem = this->getModel()->invisibleRootItem();
        }
        newItem = newItem->child(item->row() + offset, item->column());
        if (newItem != nullptr)
        {
            element = reinterpret_cast<SystemCustomStructureElement *>(
                newItem->data().value<quintptr>());
        }
        if (offset < 0)
        {
            offset--;
        } else
        {
            offset++;
        }

        // New parent
        if (newItem == nullptr && item->parent() != nullptr)
        {
            item = item->parent();
            if (offset < 0)
            {
                offset = -1;
            } else
            {
                offset = 1;
            }
            newItem = item->parent();
            if (newItem == nullptr)
            {
                newItem = this->getModel()->invisibleRootItem();
            }
            newItem = newItem->child(item->row() + offset, item->column());
            if (newItem != nullptr)
            {
                element = reinterpret_cast<SystemCustomStructureElement *>(
                    newItem->data().value<quintptr>());
            }
            if (offset < 0)
            {
                offset--;
            } else
            {
                offset++;
            }
        }
        if (newItem != nullptr)
        {
            this->selectionModel()->clear();
            this->selectionModel()->select(newItem->index(),
                QItemSelectionModel::SelectCurrent);
            if (element != nullptr)
            {
                this->selectChildren(newItem);
            }
            this->onSelectionChanged(newItem->index(), itemBegin->index());
        }
    }
}

// -------------------------------------------------------

void WidgetTreeStructure::newItem(QStandardItem *selected)
{
    bool isProperty = reinterpret_cast<SystemCustomStructureElement *>(selected
        ->parent()->data().value<quintptr>())->value()->kind() ==
        PrimitiveValueKind::CustomStructure;
    SystemCustomStructureElement *element = new SystemCustomStructureElement(-1,
        "", isProperty);
    QStandardItemModel *parentModel = this->getParentModel(selected, element);
    RPM::get()->setSelectedList(parentModel);
    emit beforeOpeningWindow();
    if (element->openDialog())
    {
        QStandardItem *root = this->getRootOfItem(selected);
        int index = selected->row();
        QStandardItem *item = this->addNewItem(element, root, index);
        if (element->value()->kind() == PrimitiveValueKind::CustomStructure ||
            element->value()->kind() == PrimitiveValueKind::CustomList)
        {
            QStandardItem *endItem = element->getModelRow().at(0);
            endItem->setText(element->getStringEnd());
            root->insertRow(index + 1, endItem);
            item->appendRow(new QStandardItem(">"));
            this->expand(item->index());
        }
        parentModel->appendRow(element->getModelRow());
    } else
    {
        delete element;
    }
    emit windowClosed();
    RPM::get()->setSelectedList(m_completeList);
}

// -------------------------------------------------------

void WidgetTreeStructure::editItem(QStandardItem *selected)
{
    SystemCustomStructureElement *element = reinterpret_cast<
        SystemCustomStructureElement *>(selected->data().value<quintptr>());
    int previousID, newID;
    previousID = element->id();
    RPM::get()->setSelectedList(this->getParentModel(selected));
    emit beforeOpeningWindow();
    if (element->openDialog())
    {
        newID = element->id();
        if (previousID != newID)
        {
            emit idChanged(previousID, newID);
        }
        setItem(selected, element);
    }
    emit windowClosed();
    RPM::get()->setSelectedList(m_completeList);
}

// -------------------------------------------------------

void WidgetTreeStructure::pasteItem(QStandardItem* selected)
{
    if (m_copiedItem != nullptr)
    {
        SystemCustomStructureElement *element = reinterpret_cast<
            SystemCustomStructureElement *>(m_copiedItem->createCopy());
        QStandardItemModel *parentModel = this->getParentModel(selected, element);
        int row = selected->row();
        if (element->isProperty())
        {
            bool testName = false;
            SystemCustomStructureElement *otherElement;
            while (!testName)
            {
                testName = true;
                for (int i = 0, l = parentModel->invisibleRootItem()->rowCount()
                    ; i < l; i++)
                {
                    otherElement = reinterpret_cast<SystemCustomStructureElement
                        *>(SuperListItem::getItemModelAt(parentModel, i));
                    if (otherElement != nullptr && i != row)
                    {
                        if (element->name() == otherElement->name())
                        {
                            testName = false;
                            element->setName(element->name() + "_copy");
                        }
                    }
                }
            }
        }

        // Model
        SystemCustomStructureElement *previous = reinterpret_cast<
            SystemCustomStructureElement *>(SuperListItem::getItemModelAt(
            parentModel, row));
        if (previous != nullptr)
        {
            parentModel->removeRow(row);
        }
        parentModel->insertRow(row, element->getModelRow());

        this->setItem(selected, element);
    }
}

// -------------------------------------------------------

void WidgetTreeStructure::deleteItem(QStandardItem* selected)
{
    SystemCustomStructureElement *element = reinterpret_cast<
        SystemCustomStructureElement *>(selected->data().value<quintptr>());

    // Can't delete empty node
    if (element != nullptr)
    {
        // If can be empty
        if (m_canBeEmpty || p_model->invisibleRootItem()->rowCount() > 2)
        {
            QStandardItem *root = getRootOfItem(selected);
            int row = selected->row();

            // Model
            SystemCustomStructureElement *parentElement = reinterpret_cast<
                SystemCustomStructureElement *>(selected->parent()->data().value
                <quintptr>());
            (element->isProperty() ? parentElement->value()->customStructure() :
                parentElement->value()->customList())->model()->removeRow(row);

            QModelIndex index = selected->index();
            root->removeRow(row);
            root->removeRow(row);
            setCurrentIndex(index);
            emit deletingItem(element, row);
            delete element;
            emit needsUpdateJson(nullptr);
            emit modelUpdated();
        }
    }
}

// -------------------------------------------------------

void WidgetTreeStructure::mousePressEvent(QMouseEvent *event)
{
    // If first or last node, don't select
    QModelIndex index = this->indexAt(event->pos());
    QStandardItem *item = p_model->itemFromIndex(index);
    if (item == this->first() || item == this->last())
    {
        return;
    }

    // Else, continue...
    QList<QStandardItem *> prevItems = this->getAllSelected();
    QTreeView::mousePressEvent(event);
    this->selectionModel()->clear();
    if (item == nullptr)
    {
        return;
    }
    this->selectionModel()->select(index, QItemSelectionModel::Select);
    this->selectChildren(item, QItemSelectionModel::Select);
    this->repaint();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTreeStructure::onSelectionChanged(QModelIndex index, QModelIndex
    indexBefore)
{
    QStandardItem *item = p_model->itemFromIndex(index);
    if (item == this->first() || item == this->last())
    {
        item = p_model->itemFromIndex(indexBefore);
        this->selectionModel()->clear();
        if (item != nullptr && item != this->first() && item != this->last())
        {
            this->selectionModel()->select(indexBefore, QItemSelectionModel
                ::Select);
            this->selectChildren(item, QItemSelectionModel::Select);
        }
        this->repaint();
    } else
    {
        item = p_model->itemFromIndex(index);
        this->selectionModel()->clear();
        if (item != nullptr)
        {
            this->selectionModel()->select(index, QItemSelectionModel
                ::Select);
            this->selectChildren(item, QItemSelectionModel::Select);
            this->repaint();
        }
    }
}
