/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "widgetconditionslist.h"
#include "dialogcommandconditions.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetConditionsList::WidgetConditionsList(QWidget *parent) :
    QListView(parent)
{

}

void WidgetConditionsList::initializeModel(QStandardItemModel* m){
    m_model = m;
    this->setModel(m_model);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetConditionsList::updateAllNodesString(){
    for (int i = 0; i < m_model->rowCount(); i++){
        EventCommand* command = (EventCommand*) m_model->item(i)->data()
                                .value<quintptr>();
        m_model->item(i)->setText(command->toString());
    }
}
// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetConditionsList::mouseDoubleClickEvent(QMouseEvent* event){
    if (event->button() == Qt::MouseButton::LeftButton){
        QStandardItem* selected = m_model->itemFromIndex(this->selectionModel()
                                                         ->currentIndex());
        if (selected != nullptr){
            if (!selected->data().isNull()){
                DialogCommandConditions dialog(nullptr, true);
                if (dialog.exec() == QDialog::Accepted){
                    // Ading condition to list
                    EventCommand* command = dialog.getCommand();
                    QStandardItem* item = new QStandardItem();
                    item->setData(QVariant::fromValue(
                                      reinterpret_cast<quintptr>(command)));
                    item->setText(command->toString());
                    m_model->invisibleRootItem()->insertRow(selected->row(),
                                                            item);

                    // Update text in nodes
                    updateAllNodesString();
                }
            }
        }
    }
}
