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

#ifndef PANELOBJECT_H
#define PANELOBJECT_H

#include <QCheckBox>
#include <QPushButton>
#include "systemcommonobject.h"
#include "widgettreecommands.h"
#include "systemstate.h"

// -------------------------------------------------------
//
//  CLASS PanelObject
//
//  The object panel for common and local objects.
//
// -------------------------------------------------------

namespace Ui {
class PanelObject;
}

class PanelObject : public QWidget
{
    Q_OBJECT

public:
    explicit PanelObject(QWidget *parent = 0);
    virtual ~PanelObject();
    void deleteStateModel();
    void initializeList(QStandardItemModel* list);
    void updateList();
    void initializeModel(SystemCommonObject* object);
    void updateModel();
    void clear();
    void setInheritanceName(int index, QString name);
    void initializeCommonInheritance();
    void showStateWidgets(bool b);
    void showName(bool b);
    void updateReactions();
    void updateReactionsWidgets();
    SystemState* getSelectedState() const;
    void updateStateOptions(SystemState* state);
    void passToSprite();
    void passToNone();

private:
    Ui::PanelObject *ui;
    SystemCommonObject* m_model;
    QStandardItemModel* m_list;
    QVector<WidgetTreeCommands*> m_reactions;
    QVector<QCheckBox*> m_checkBoxes;
    QVector<QPushButton*> m_pushButtons;
    SystemReaction* m_copiedReaction;

private slots:
    void on_lineEditName_textChanged(const QString &text);
    void on_comboBoxInheritance_currentIndexChanged(int index);
    void on_updateJsonStates(SuperListItem*);
    void on_updateJsonEvents(SuperListItem*);
    void on_stateChanged(QModelIndex index, QModelIndex);
    void on_eventChanged(QModelIndex index, QModelIndex);
    void on_tabWidgetCommands_currentChanged(int index);
    void on_blockingHeroChanged(bool c);
    void on_checkBoxMoveAnimation_toggled(bool checked);
    void on_checkBoxStopAnimation_toggled(bool checked);
    void on_checkBoxDirectionFix_toggled(bool checked);
    void on_checkBoxThrough_toggled(bool checked);
    void on_checkBoxSetWithCamera_toggled(bool checked);
    void on_checkBoxPixelOffset_toggled(bool checked);
    void on_comboBoxGraphics_currentIndexChanged(int index);
    void on_copyReaction();
    void on_pasteReaction();
};

#endif // PANELOBJECT_H
