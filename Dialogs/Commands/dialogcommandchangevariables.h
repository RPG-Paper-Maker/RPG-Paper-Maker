/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGCOMMANDCHANGEVARIABLES_H
#define DIALOGCOMMANDCHANGEVARIABLES_H

#include <QVector>
#include "dialogcommand.h"
#include "variablesdatas.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeVariables
//
//  A dialog used for changing one or several variables values.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeVariables;
}

class DialogCommandChangeVariables : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeVariables(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeVariables();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeVariables *ui;
    QStandardItemModel* m_modelObjects;

    void selection(QVector<QString> &command) const;
    void operation(QVector<QString>& command) const;
    void value(QVector<QString>& command) const;

private slots:
    void on_radioButtonOneVariable_toggled(bool checked);
    void on_radioButtonRange_toggled(bool checked);
    void on_radioButtonNumber_toggled(bool checked);
    void on_radioButtonRandom_toggled(bool checked);
};

#endif // DIALOGCOMMANDCHANGEVARIABLES_H
