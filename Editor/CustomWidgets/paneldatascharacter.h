/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELDATASCHARACTER_H
#define PANELDATASCHARACTER_H

#include <QWidget>
#include "systemhero.h"
#include "panelsuperlist.h"
#include "paneldatasclass.h"

// -------------------------------------------------------
//
//  CLASS PanelDatasCharacter
//
//  The panel for heroes and monsters datas.
//
// -------------------------------------------------------

namespace Ui {
class PanelDatasCharacter;
}

class PanelDatasCharacter : public QWidget
{
    Q_OBJECT

public:
    explicit PanelDatasCharacter(QWidget *parent = nullptr);
    ~PanelDatasCharacter();
    void setPanelSuperList(PanelSuperList *list);
    PanelDatasClass * panelDatasClass() const;
    int finalLevel() const;

    void initialize();
    void update(SystemHero *hero, int classIndex);
    SystemHero * currentHero();
    void updateClasses();
    void updateClass();

private:
    Ui::PanelDatasCharacter *ui;
    PanelSuperList *m_panelSuperList;

private slots:
    void on_comboBoxClass_currentIndexChanged(int index);
    void on_battlerPictureChanged(SystemPicture *picture);
    void on_facesetPictureChanged(SystemPicture* picture);
};

#endif // PANELDATASCHARACTER_H
