/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

void WidgetConditionsList::initializeModel(QStandardItemModel *m) {
    m_model = m;
    this->setModel(m_model);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetConditionsList::updateAllNodesString() {
    for (int i = 0; i < m_model->rowCount(); i++) {
        EventCommand *command = reinterpret_cast<EventCommand *>(m_model->item(i)
            ->data().value<quintptr>());
        m_model->item(i)->setText(command->toString());
    }
}
// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetConditionsList::mouseDoubleClickEvent(QMouseEvent *event) {
    if (event->button() == Qt::MouseButton::LeftButton) {
        QStandardItem *selected = m_model->itemFromIndex(this->selectionModel()
            ->currentIndex());
        if (selected != nullptr) {
            if (!selected->data().isNull()) {
                DialogCommandConditions dialog(nullptr, true);
                if (dialog.exec() == QDialog::Accepted) {
                    // Ading condition to list
                    EventCommand *command = dialog.getCommand();
                    QStandardItem *item = new QStandardItem();
                    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>
                        (command)));
                    item->setText(command->toString());
                    m_model->invisibleRootItem()->insertRow(selected->row(), item);

                    // Update text in nodes
                    updateAllNodesString();
                }
            }
        }
    }
}
