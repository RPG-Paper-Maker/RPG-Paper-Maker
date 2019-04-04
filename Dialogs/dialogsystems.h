/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    void initializeTitleScreenGameOver(GameDatas *gameDatas);
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
    void on_comboBoxWindowSkin_currentIndexChanged(int index);
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
