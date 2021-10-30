// IMPORTS
const git = require('simple-git/promise');
const Utils = require("./testutils");
const path = require('path');
const fs = require('fs-extra');


// CONSTS
const REPO_NAME = 'MOOC_git_mod6-tf_agenda';
const PATH_ASSIGNMENT = path.resolve(path.join(__dirname, "../"));
const PATH_REPO = path.join(PATH_ASSIGNMENT, REPO_NAME);
const BRANCH_NAME = "remotes/origin/corrected_tf_agenda";

// GLOBALS
let error_critical = null;
let output = null;
let commit_1 = null;
let commit_2 = null;
let commit_3 = null;
let mygit = git(PATH_ASSIGNMENT);
let REPO_URL = "";
let student = "";


describe('Rebase 2', function () {

    it("(Prechecks) Comprobando que existe git_account", async function () {
        this.score = 0;
        this.msg_err = "No se ha encontrado el fichero 'git_account' que debe contener el nombre de usuario de github";

        student = fs.readFileSync(path.join(PATH_ASSIGNMENT, 'git_account'), {encoding: 'utf8'}).replace(/^\s+|\s+$/g, '');;
        REPO_URL = `git@github.com:${student}/${REPO_NAME}.git`;
        this.msg_ok = `Se ha encontrado el fichero 'git_account': ${student}`;
        should.exist(student);
    });

    it("Buscando la rama 'main'", async function () {
        this.score = 1;
        this.msg_ok = `Encontrada la rama 'main' en ${REPO_URL}`;
        [_, _] = await Utils.to(fs.remove(PATH_REPO));
        [error_repo, _] = await Utils.to(mygit.clone(REPO_URL));
        if (error_repo) {
            this.msg_err = `Rama 'main' no encontrada en ${REPO_URL}.\n\t\tError: >>${error_repo}<<`;
            error_critical = this.msg_err;
        }
        await Utils.to(mygit.cwd(PATH_REPO));
        should.not.exist(error_repo);
    });

    it(`Buscando la rama '${BRANCH_NAME}'`, async function () {
        const expected = BRANCH_NAME;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            let output;
            this.msg_ok = `Encontrada la rama ${BRANCH_NAME}`;
            [error_branch, branches] = await Utils.to(mygit.branch());
            if (error_branch) {
                this.msg_err = `Error al leer las ramas en ${REPO_URL}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            } else {
                output = branches.all;
            }
            const no_branch = !Utils.search(expected, output);
            if (no_branch){
                this.msg_err = `Rama '${BRANCH_NAME}' NO encontrada`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            Utils.search(expected, output).should.be.equal(true);
        }
    });


    it(`Comprobando el número de commits en'${BRANCH_NAME}'`, async function () {
        const expected = 3;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            await Utils.to(mygit.checkout(BRANCH_NAME));

            [error_log, log] = await Utils.to(mygit.log());
            if (error_log) {
                this.msg_err = `Error al leer los logs de ${REPO_URL}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            let output = log.all.length;
            if (output < expected) {
                this.msg_err = `El número de commits en '${BRANCH_NAME}' es incorrecto\n\t\t\tEsperados: ${expected}\n\t\t\tEncontrados: ${output}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            commit_1 = log.all[log.all.length - 1].hash.substring(0, 7);
            commit_2 = log.all[log.all.length - 2].hash.substring(0, 7);
            commit_3 = log.all[log.all.length - 3].hash.substring(0, 7);
            this.msg_ok = `El número de commits en '${BRANCH_NAME}' es correcto`;
            output.should.be.equal(expected);

        }
    });

    it("Comprobando si el teléfono de John aparece correctamente en el resultado final", async function () {
        const expected = /John:\s+913-677-899;/;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [err_show, output] = await Utils.to(mygit.show([commit_1]));
            this.msg_ok = `Se ha encontrado '${expected}' en la rama '${BRANCH_NAME}' commit ${commit_1}`;
            this.msg_err = `NO se ha encontrado '${expected}' en la rama '${BRANCH_NAME}' commit ${commit_1}`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it("Comprobando si el teléfono de Eva aparece correctamente en el resultado final", async function () {
        const expected = /Eva:\s+915-768-455;/;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [err_show, output] = await Utils.to(mygit.show([commit_2]));
            this.msg_ok = `Se ha encontrado '${expected}' en la rama '${BRANCH_NAME}' commit ${commit_2}`;
            this.msg_err = `NO se ha encontrado'${expected}' en la rama '${BRANCH_NAME}' commit ${commit_2}`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

    it("Comprobando si el teléfono de Mary aparece correctamente en el resultado final", async function () {
        const expected = /Mary:\s+918-555-555;/;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [err_show, output] = await Utils.to(mygit.show([commit_3]));
            this.msg_ok = `Se ha encontrado '${expected}' en la rama '${BRANCH_NAME}' commit ${commit_3}`;
            this.msg_err = `NO se ha encontrado'${expected}' en la rama '${BRANCH_NAME}' commit ${commit_3}`;
            Utils.search(expected, output).should.be.equal(true);
        }
    });

});
