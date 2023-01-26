/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMBATTLEMAP_H
#define DIALOGSYSTEMBATTLEMAP_H

#include <QDialog>
#include "systembattlemap.h"
#include "treemapdatas.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemBattleMap
//
//  A dialog used for editing the model of a system battle map.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemBattleMap;
}

class DialogSystemBattleMap : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemBattleMap(SystemBattleMap &battleMap, QWidget *parent =
        nullptr);
    ~DialogSystemBattleMap();

    TreeMapTag * currentTag() const;

private:
    Ui::DialogSystemBattleMap *ui;
    SystemBattleMap &m_battleMap;

    void translate();

private slots:
    void accept();
};

#endif // DIALOGSYSTEMBATTLEMAP_H
