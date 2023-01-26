/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEEXPERIENCECURVE_H
#define DIALOGCOMMANDCHANGEEXPERIENCECURVE_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandChangeExperienceCurve;
}

class DialogCommandChangeExperienceCurve : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeExperienceCurve(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeExperienceCurve();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeExperienceCurve *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

public slots:
    void on_radioButtonHeroEnemyInstanceID_toggled(bool checked);
    void on_radioButtonEntire_toggled(bool checked);
};

#endif // DIALOGCOMMANDCHANGEEXPERIENCECURVE_H
