/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
#ifndef PANELDATASMONSTER_H
#define PANELDATASMONSTER_H

#include <QWidget>
#include "systemmonster.h"
#include "panelsuperlist.h"


// -------------------------------------------------------
//
//  CLASS PanelDatasMonster
//
//  The panel for monsters datas.
//
// -------------------------------------------------------

namespace Ui {
class PanelDatasMonster;
}

class PanelDatasMonster : public QWidget
{
    Q_OBJECT

public:
    explicit PanelDatasMonster(QWidget *parent = nullptr);
    ~PanelDatasMonster();
    void setPanelSuperList(PanelSuperList *list);
    int finalLevel() const;

    void initialize();
    void update(SystemMonster *monster, int classIndex);
    SystemMonster * currentMonster();
    void updateClasses();
    void updateClass();

private:
    Ui::PanelDatasMonster *ui;
    PanelSuperList *m_panelSuperList;

    void translate();

public slots:
    void on_maxLevelChanged(int lvl);
};

#endif // PANELDATASMONSTER_H
