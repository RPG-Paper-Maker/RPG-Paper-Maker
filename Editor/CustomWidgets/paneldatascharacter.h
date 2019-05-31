/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
