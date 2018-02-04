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

#ifndef DIALOGSYSTEMS_H
#define DIALOGSYSTEMS_H

#include <QDialog>
#include "eventcommand.h"
#include "gamedatas.h"
#include "systemevent.h"
#include "systemcommonreaction.h"
#include "systemcommonobject.h"

// -------------------------------------------------------
//
//  CLASS DialogSystems
//
//  A dialog used for setting the maximum number of items in
//  a super list.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystems;
}

class DialogSystems : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystems(GameDatas *gameDatas, QWidget *parent = 0);
    ~DialogSystems();
    int getSquareSize() const;

private:
    Ui::DialogSystems *ui;
    void initializeSystem(GameDatas *gameDatas);
    void initializeBattleSystem(GameDatas *gameDatas);
    void updateStatisticsBase();
    void initializeMainMenu(GameDatas *gameDatas);
    void initializeEvents(GameDatas *gameDatas);
    void updateEvents(SystemEvent *sysEvent);
    void initializeStates(GameDatas *gameDatas);
    void initializeCommonReactors(GameDatas *gameDatas);
    void updateCommonReactors(SystemCommonReaction *sysCommonReactor);
    void initializeCommonObjects(GameDatas *gameDatas);
    void updateCommonObjects(SystemCommonObject *sysCommonObject);

private slots:
    void on_spinBoxSquareSize_valueChanged(int i);
    void on_comboBoxBattleLevel_currentIndexChanged(int index);
    void on_comboBoxBattleExp_currentIndexChanged(int index);
    void on_statisticsUpdated();
    void on_equipmentUpdated();
    void on_pageEventsSelected(QModelIndex index, QModelIndex);
    void on_pageCommonReactorsSelected(QModelIndex index, QModelIndex);
    void on_pageCommonObjectsSelected(QModelIndex index, QModelIndex);
    void on_commonObjectNameChanged(QString);
    void on_commonObjectMaximumChanged();
    void on_checkBoxCommonReactionBlockingHero_toggled(bool checked);
};

#endif // DIALOGSYSTEMS_H
